/**
 * Vanilla JS Date Range Picker — no dependencies.
 *	Written By- Cluade -Prompted by ItsAtomtech
 * Usage:
 *   <input type="text" id="myRange" placeholder="Select a date range">
 *   <script src="daterangepicker.js"></script>
 *   <script>
 *     const picker = new DateRangePicker(document.getElementById('myRange'), {
 *       format: 'MM/DD/YYYY',
 *       minDate: '2025-01-01',
 *       maxDate: null,
 *       showPresets: true,
 *       onApply: (start, end, formatted) => {
 *         console.log(start, end, formatted.startFormatted, formatted.endFormatted);
 *       }
 *     });
 *   </script>
 */
(function (global) {
  'use strict';

  function startOfDay(d) {
    return new Date(d.getFullYear(), d.getMonth(), d.getDate());
  }

  function sameDay(a, b) {
    return !!a && !!b &&
      a.getFullYear() === b.getFullYear() &&
      a.getMonth() === b.getMonth() &&
      a.getDate() === b.getDate();
  }

  function addMonths(date, n) {
    return new Date(date.getFullYear(), date.getMonth() + n, 1);
  }

  function addDays(date, n) {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate() + n);
  }

  function pad(n) {
    return n < 10 ? '0' + n : '' + n;
  }

  function formatDate(date, fmt) {
    if (!date) return '';
    const map = {
      YYYY: date.getFullYear(),
      MM: pad(date.getMonth() + 1),
      DD: pad(date.getDate())
    };
    return fmt.replace(/YYYY|MM|DD/g, (m) => map[m]);
  }

  const MONTH_NAMES = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const DAY_NAMES = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

  const PRESETS = [
    { label: 'Today', range: () => { const t = startOfDay(new Date()); return [t, t]; } },
    { label: 'Yesterday', range: () => { const t = addDays(startOfDay(new Date()), -1); return [t, t]; } },
    { label: 'Last 7 days', range: () => { const t = startOfDay(new Date()); return [addDays(t, -6), t]; } },
    { label: 'Last 30 days', range: () => { const t = startOfDay(new Date()); return [addDays(t, -29), t]; } },
    {
      label: 'This month',
      range: () => { const t = new Date(); return [new Date(t.getFullYear(), t.getMonth(), 1), startOfDay(t)]; }
    },
    {
      label: 'Last month',
      range: () => {
        const t = new Date();
        const first = new Date(t.getFullYear(), t.getMonth() - 1, 1);
        const last = new Date(t.getFullYear(), t.getMonth(), 0);
        return [first, last];
      }
    }
  ];

  class DateRangePicker {
    constructor(input, options) {
      if (!input) throw new Error('DateRangePicker: an input element is required');
      this.input = input;
      this.options = Object.assign({
        startDate: null,
        endDate: null,
        minDate: null,
        maxDate: null,
        format: 'MM/DD/YYYY',
        separator: ' - ',
        showPresets: true,
        autoApplyOnRangeComplete: false,
        onApply: null,
        onCancel: null
      }, options);

      this.startDate = this.options.startDate ? startOfDay(new Date(this.options.startDate)) : null;
      this.endDate = this.options.endDate ? startOfDay(new Date(this.options.endDate)) : null;
      this.pendingStart = this.startDate;
      this.pendingEnd = this.endDate;
      this.hoverDate = null;
      this.leftView = new Date((this.startDate || new Date()).getFullYear(), (this.startDate || new Date()).getMonth(), 1);
      this.isOpen = false;

      this._onDocClick = this._onDocClick.bind(this);
      this._onKeydown = this._onKeydown.bind(this);
      this._reposition = () => this._position();

      this._buildPopup();
      this._bindInput();
      this._updateInputDisplay();
    }

    _bindInput() {
      this.input.setAttribute('readonly', 'readonly');
      this.input.classList.add('drp-input');
      this._openHandler = () => this.open();
      this.input.addEventListener('click', this._openHandler);
    }

    _buildPopup() {
      this.popup = document.createElement('div');
      this.popup.className = 'drp-popup';
      this.popup.innerHTML = `
        <div class="drp-body">
          ${this.options.showPresets ? '<div class="drp-presets"></div>' : ''}
          <div class="drp-calendars">
            <div class="drp-panel drp-panel-left">
              <div class="drp-header">
                <button type="button" class="drp-nav drp-prev" aria-label="Previous month">&#8249;</button>
                <span class="drp-month-label"></span>
                <button type="button" class="drp-nav" style="visibility:hidden">&#8250;</button>
              </div>
              <div class="drp-weekdays"></div>
              <div class="drp-days"></div>
            </div>
            <div class="drp-panel drp-panel-right">
              <div class="drp-header">
                <button type="button" class="drp-nav" style="visibility:hidden">&#8249;</button>
                <span class="drp-month-label"></span>
                <button type="button" class="drp-nav drp-next" aria-label="Next month">&#8250;</button>
              </div>
              <div class="drp-weekdays"></div>
              <div class="drp-days"></div>
            </div>
          </div>
        </div>
        <div class="drp-footer">
          <span class="drp-selection-text"></span>
          <div class="drp-actions">
            <button type="button" class="drp-btn drp-btn-cancel">Cancel</button>
            <button type="button" class="drp-btn drp-btn-apply">Apply</button>
          </div>
        </div>
      `;
      document.body.appendChild(this.popup);

      this.leftPanel = this.popup.querySelector('.drp-panel-left');
      this.rightPanel = this.popup.querySelector('.drp-panel-right');
      this.selectionText = this.popup.querySelector('.drp-selection-text');
      this.presetsEl = this.popup.querySelector('.drp-presets');

      this.popup.querySelector('.drp-panel-left .drp-prev').addEventListener('click', () => this._shiftView(-1));
      this.popup.querySelector('.drp-panel-right .drp-next').addEventListener('click', () => this._shiftView(1));
      this.popup.querySelector('.drp-btn-apply').addEventListener('click', () => this._apply());
      this.popup.querySelector('.drp-btn-cancel').addEventListener('click', () => this._cancel());

      if (this.options.showPresets) this._renderPresets();
    }

    _renderPresets() {
      this.presetsEl.innerHTML = '';
      PRESETS.forEach((p) => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'drp-preset-btn';
        btn.textContent = p.label;
        btn.addEventListener('click', () => {
          const [s, e] = p.range();
          this.pendingStart = startOfDay(s);
          this.pendingEnd = startOfDay(e);
          this.leftView = new Date(this.pendingStart.getFullYear(), this.pendingStart.getMonth(), 1);
          this._renderCalendars();
        });
        this.presetsEl.appendChild(btn);
      });
    }

    _shiftView(n) {
      this.leftView = addMonths(this.leftView, n);
      this._renderCalendars();
    }

    _renderCalendars() {
      this._renderMonth(this.leftPanel, this.leftView);
      this._renderMonth(this.rightPanel, addMonths(this.leftView, 1));
      this._updateSelectionText();
    }

    _renderMonth(panel, monthDate) {
      panel.querySelector('.drp-month-label').textContent =
        `${MONTH_NAMES[monthDate.getMonth()]} ${monthDate.getFullYear()}`;

      const weekdaysEl = panel.querySelector('.drp-weekdays');
      weekdaysEl.innerHTML = DAY_NAMES.map((d) => `<span>${d}</span>`).join('');

      const daysEl = panel.querySelector('.drp-days');
      daysEl.innerHTML = '';

      const year = monthDate.getFullYear();
      const month = monthDate.getMonth();
      const startOffset = new Date(year, month, 1).getDay();
      const daysInMonth = new Date(year, month + 1, 0).getDate();

      for (let i = 0; i < startOffset; i++) {
        daysEl.appendChild(this._emptyCell());
      }
      for (let day = 1; day <= daysInMonth; day++) {
        daysEl.appendChild(this._dayCell(new Date(year, month, day)));
      }
    }

    _emptyCell() {
      const span = document.createElement('span');
      span.className = 'drp-day drp-day-empty';
      return span;
    }

    _dayCell(date) {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'drp-day';
      btn.textContent = date.getDate();
      btn._date = date;

      const disabled = this._isDisabled(date);
      if (disabled) {
        btn.disabled = true;
        btn.classList.add('drp-day-disabled');
      }
      if (sameDay(date, new Date())) btn.classList.add('drp-day-today');

      this._applyRangeClasses(btn, date);

      if (!disabled) {
        btn.addEventListener('click', () => this._selectDate(date));
        btn.addEventListener('mouseenter', () => {
          // Guard: only touch state (and only toggle classes, never rebuild
          // the DOM) when the hovered day actually changes. Rebuilding here
          // would replace the button under the cursor, which triggers a
          // synthetic mouseenter on the new node and loops forever, eating
          // every subsequent click.
          if (this.pendingStart && !this.pendingEnd && !sameDay(this.hoverDate, date)) {
            this.hoverDate = date;
            this._updateRangeHighlighting();
          }
        });
      }
      return btn;
    }

    _applyRangeClasses(btn, date) {
      btn.classList.remove(
        'drp-day-start', 'drp-day-end', 'drp-day-in-range',
        'drp-day-hover-range', 'drp-day-hover-end'
      );

      const { start, end } = this._effectiveRange();
      if (start && sameDay(date, start)) btn.classList.add('drp-day-start');
      if (end && sameDay(date, end)) btn.classList.add('drp-day-end');
      if (start && end && date > start && date < end) btn.classList.add('drp-day-in-range');

      if (start && !end && this.hoverDate) {
        const lo = start < this.hoverDate ? start : this.hoverDate;
        const hi = start < this.hoverDate ? this.hoverDate : start;
        if (date > lo && date < hi) btn.classList.add('drp-day-hover-range');
        if (sameDay(date, this.hoverDate) && !sameDay(date, start)) btn.classList.add('drp-day-hover-end');
      }
    }

    // Lightweight hover update: only re-toggles classes on the buttons that
    // already exist in the DOM. Never rebuilds nodes, so it can't trigger
    // the synthetic-mouseenter loop that a full _renderCalendars() would.
    _updateRangeHighlighting() {
      const dayButtons = this.popup.querySelectorAll('.drp-day:not(.drp-day-empty)');
      dayButtons.forEach((btn) => {
        if (btn._date) this._applyRangeClasses(btn, btn._date);
      });
      this._updateSelectionText();
    }

    _isDisabled(date) {
      const { minDate, maxDate } = this.options;
      if (minDate && date < startOfDay(new Date(minDate))) return true;
      if (maxDate && date > startOfDay(new Date(maxDate))) return true;
      return false;
    }

    _effectiveRange() {
      return { start: this.pendingStart, end: this.pendingEnd };
    }

    _selectDate(date) {
      if (!this.pendingStart || (this.pendingStart && this.pendingEnd)) {
        this.pendingStart = date;
        this.pendingEnd = null;
      } else if (date < this.pendingStart) {
        this.pendingEnd = this.pendingStart;
        this.pendingStart = date;
      } else {
        this.pendingEnd = date;
      }

      this.hoverDate = null;

      if (this.pendingStart && this.pendingEnd && this.options.autoApplyOnRangeComplete) {
        this._apply();
        return;
      }
      this._renderCalendars();
    }

    _updateSelectionText() {
      const { start, end } = this._effectiveRange();
      const fmt = this.options.format;
      if (start && end) {
        this.selectionText.textContent = `${formatDate(start, fmt)}${this.options.separator}${formatDate(end, fmt)}`;
      } else if (start) {
        this.selectionText.textContent = `${formatDate(start, fmt)}${this.options.separator}?`;
      } else {
        this.selectionText.textContent = 'Select a start and end date';
      }
    }

    _updateInputDisplay() {
      if (this.startDate && this.endDate) {
        const fmt = this.options.format;
        this.input.value = `${formatDate(this.startDate, fmt)}${this.options.separator}${formatDate(this.endDate, fmt)}`;
      } else {
        this.input.value = '';
      }
    }

    _apply() {
      if (!this.pendingStart || !this.pendingEnd) return;
      this.startDate = this.pendingStart;
      this.endDate = this.pendingEnd;
      this._updateInputDisplay();
      this.close();
      if (typeof this.options.onApply === 'function') {
        this.options.onApply(this.startDate, this.endDate, {
          startFormatted: formatDate(this.startDate, this.options.format),
          endFormatted: formatDate(this.endDate, this.options.format)
        });
      }
    }

    _cancel() {
      this.pendingStart = this.startDate;
      this.pendingEnd = this.endDate;
      this.hoverDate = null;
      this.close();
      if (typeof this.options.onCancel === 'function') this.options.onCancel();
    }

    _onDocClick(e) {
      if (this.popup.contains(e.target) || this.input.contains(e.target)) return;
      this._cancel();
    }

    _onKeydown(e) {
      if (e.key === 'Escape') this._cancel();
    }

    _position() {
      const rect = this.input.getBoundingClientRect();
      const popupRect = this.popup.getBoundingClientRect();
      let top = rect.bottom + window.scrollY + 6;
      let left = rect.left + window.scrollX;

      if (left + popupRect.width > window.innerWidth - 12) {
        left = Math.max(12, window.innerWidth - popupRect.width - 12);
      }
      this.popup.style.top = `${top}px`;
      this.popup.style.left = `${left}px`;
    }

    open() {
      if (this.isOpen) return;
      this.pendingStart = this.startDate;
      this.pendingEnd = this.endDate;
      this.hoverDate = null;
      const anchor = this.startDate || new Date();
      this.leftView = new Date(anchor.getFullYear(), anchor.getMonth(), 1);

      this.popup.classList.add('drp-open');
      this._renderCalendars();
      this._position();
      this.isOpen = true;

      document.addEventListener('mousedown', this._onDocClick);
      document.addEventListener('keydown', this._onKeydown);
      window.addEventListener('resize', this._reposition);
    }

    close() {
      if (!this.isOpen) return;
      this.popup.classList.remove('drp-open');
      this.isOpen = false;
      document.removeEventListener('mousedown', this._onDocClick);
      document.removeEventListener('keydown', this._onKeydown);
      window.removeEventListener('resize', this._reposition);
    }

    getRange() {
      return { startDate: this.startDate, endDate: this.endDate };
    }

    setRange(start, end) {
      this.startDate = start ? startOfDay(new Date(start)) : null;
      this.endDate = end ? startOfDay(new Date(end)) : null;
      this.pendingStart = this.startDate;
      this.pendingEnd = this.endDate;
      this._updateInputDisplay();
    }

    destroy() {
      this.close();
      this.popup.remove();
      this.input.removeEventListener('click', this._openHandler);
    }
  }

  global.DateRangePicker = DateRangePicker;
})(window);
