const MIMETYPES = {
	"js": "text/javascript",
	"javascript": "text/javascript",
	"sql": "text/x-mariadb",
	"php":"application/x-httpd-php",
	"java":"text/x-java",
	"python":"text/x-cython",
}


const fileEXT = {
	"js": "js",
	"javascript": "js",
	"sql": "sql",
	"php":"php",
	"java":"java",
	"python":"py",
    
}




let categories = {
    'js': [
        { "name": "Basics", "value": "basics" },
        { "name": "Syntax & Variables", "value": "syntax_variables" },
        { "name": "Data Types", "value": "data_types" },
        { "name": "Functions", "value": "functions" },
        { "name": "Looping and Conditions", "value": "condtions_loops" },
        { "name": "Objects & Arrays", "value": "objects_arrays" },
        { "name": "DOM & Events", "value": "dom_events" },
        { "name": "Asynchronous JS", "value": "async_js" },
        { "name": "Modules", "value": "modules" },
        { "name": "Error Handling", "value": "error_handling" },
        { "name": "Advanced Topics", "value": "advanced" },
        { "name": "Best Practices", "value": "best_practices" },
        { "name": "Projects & Examples", "value": "projects_examples" }
    ],
	


    'sql': [
        { "name": "Basics", "value": "basics" },
        { "name": "Data Definition (DDL)", "value": "ddl" },
        { "name": "Data Manipulation (DML)", "value": "dml" },
        { "name": "Queries & Filtering", "value": "queries" },
        { "name": "Joins", "value": "joins" },
        { "name": "Aggregate Functions", "value": "aggregate_functions" },
        { "name": "Subqueries", "value": "subqueries" },
        { "name": "Indexes", "value": "indexes" },
        { "name": "Views", "value": "views" },
        { "name": "Transactions", "value": "transactions" },
        { "name": "Stored Procedures & Triggers", "value": "procedures_triggers" },
        { "name": "Optimization & Best Practices", "value": "optimization_best_practices" }
    ],

    'php': [
        { "name": "Basics", "value": "basics" },
        { "name": "Syntax & Variables", "value": "syntax_variables" },
        { "name": "Data Types", "value": "data_types" },
        { "name": "Control Structures", "value": "control_structures" },
        { "name": "Functions", "value": "functions" },
        { "name": "Arrays", "value": "arrays" },
        { "name": "Forms & User Input", "value": "forms_user_input" },
        { "name": "File Handling", "value": "file_handling" },
        { "name": "Sessions & Cookies", "value": "sessions_cookies" },
        { "name": "Database (MySQL)", "value": "database_mysql" },
        { "name": "OOP in PHP", "value": "oop" },
        { "name": "Security & Validation", "value": "security_validation" },
        { "name": "Best Practices", "value": "best_practices" }
    ],

    'java': [
        { "name": "Basics", "value": "basics" },
        { "name": "Syntax & Variables", "value": "syntax_variables" },
        { "name": "Data Types", "value": "data_types" },
        { "name": "Operators & Control Flow", "value": "operators_control_flow" },
        { "name": "Methods", "value": "methods" },
        { "name": "Classes & Objects", "value": "classes_objects" },
        { "name": "Inheritance & Polymorphism", "value": "inheritance_polymorphism" },
        { "name": "Interfaces & Abstract Classes", "value": "interfaces_abstract" },
        { "name": "Collections & Generics", "value": "collections_generics" },
        { "name": "Exception Handling", "value": "exception_handling" },
        { "name": "File I/O", "value": "file_io" },
        { "name": "Multithreading", "value": "multithreading" },
        { "name": "Advanced Topics", "value": "advanced" },
        { "name": "Best Practices", "value": "best_practices" }
    ],
    
    'python': [
      { "name": "Basics", "value": "basics" },
      { "name": "Syntax & Variables", "value": "syntax_variables" },
      { "name": "Data Types", "value": "data_types" },
      { "name": "Operators & Control Flow", "value": "operators_control_flow" },
      { "name": "Functions", "value": "functions" },
      { "name": "Modules & Packages", "value": "modules_packages" },
      { "name": "Classes & Objects", "value": "classes_objects" },
      { "name": "Inheritance & Polymorphism", "value": "inheritance_polymorphism" },
      { "name": "Exception Handling", "value": "exception_handling" },
      { "name": "File I/O", "value": "file_io" },
      { "name": "Virtual Environments & Pip", "value": "venv_pip" },
      { "name": "Async & Multithreading", "value": "async_multithreading" },
      { "name": "Advanced Topics", "value": "advanced" },
      { "name": "Best Practices", "value": "best_practices" }
  ]

    
};


//Additional
categories.javascript = categories.js;




function getMimeTypes(mime){
	let type = "javascript";
		if(MIMETYPES[mime]){
			type = MIMETYPES[mime];	
		}
	
	return type;
}

function getFileTypes(mime){
	let type = mime;
		if(fileEXT[mime]){
			type = fileEXT[mime];	
		}
	
	return type;
}



function populateCategories(selectId, categoryName) {
    // Make sure the category exists
    if (!categories[categoryName]) {
        console.error(`Category "${categoryName}" not found.`);
        return;
    }

    // Get the select element
    const select = document.getElementById(selectId);
	console.log(select.value);
	
    if (!select) {
        console.error(`Select element with id "${selectId}" not found.`);
        return;
    }

    // Clear any existing options
    select.innerHTML = '';

    // Add a default "choose" option
    const defaultOption = document.createElement('option');
    defaultOption.textContent = "";
    defaultOption.value = '';
    select.appendChild(defaultOption);

    // Loop through and add each category option
    categories[categoryName].forEach(item => {
        const option = document.createElement('option');
        option.textContent = item.name;
        option.value = item.value;
        select.appendChild(option);
    });
}


function getCategoryName(language, value) {
    // Normalize language alias (ex: javascript → js)
	
	try{
		const langCategories = categories[language.toLowerCase()];
		if (!langCategories) {
			console.error(`No categories found for language "${language}"`);
			return null;
		}

		const found = langCategories.find(item => item.value === value);
		return found ? found.name : null;
	
	}catch(e){
		//return original if failed to parse.
		return value;
	}
}
