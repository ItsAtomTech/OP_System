import subprocess
import os
import sys
import psutil


def is_running(script_name):
    lock = f"{script_name}.lock"
    if os.path.exists(lock):
        with open(lock) as f:
            try:
                pid = int(f.read().strip())
            except ValueError:
                os.remove(lock)
                return False
        if psutil.pid_exists(pid):
            try:
                proc = psutil.Process(pid)
                if proc.is_running() and proc.status() != psutil.STATUS_ZOMBIE:
                    return True
            except psutil.NoSuchProcess:
                pass
        os.remove(lock)
    return False


def launch(script_name, title):
    lock = f"{script_name}.lock"

    # Use sys.executable so it always finds the correct python
    # cmd /k keeps the window open even if the script crashes
    
    
    proc = subprocess.Popen(
        ["cmd", "/k", sys.executable, script_name],
        creationflags=subprocess.CREATE_NEW_CONSOLE,
        cwd=os.path.dirname(os.path.abspath(__file__))  
    )

    with open(lock, "w") as f:
        f.write(str(proc.pid))

    print(f"[INFO] Started '{title}' (PID {proc.pid})")


# ── List here ─────────────────────────────────────────────────────
scripts = [
 #   ("cron_service.py", "Cron Service"),
    ("main.py",         "Main App (Accounting System)")
]
# ──────────────────────────────────────────────────────────────────────────────


if __name__ == "__main__":
    print(f"[INFO] Using Python: {sys.executable}")
    print(f"[INFO] Working dir : {os.path.dirname(os.path.abspath(__file__))}\n")

    for script, title in scripts:
        if not os.path.exists(script):
            print(f"[ERROR] '{script}' not found — skipping '{title}'.")
            continue

        if is_running(script):
            print(f"[SKIP] '{title}' is already running.")
        else:
            launch(script, title)

    print("\n[DONE] Launcher finished.")
    input("Press Enter to close this window...")
