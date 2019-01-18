// FIRST BUILD OUT THE MODULE PATTERN WITH THE CONTROLLERS, THEN MAKE A BASIC STRUCTURE OUTLINE WITH COMMENTS AS "TO DO LIST ITEMS" ORGANIZED IN A SUDO CODE STYLE FASHION FOR PLANNING OUT THE FLOW OF THE APP

// BUDGET CONTROLLER
var budgetController = (function(){ // IFFE ENCAPSULATION
    
    // Function Constructor for Expense Objects
    var Expense = function(id, description, value, percentage){
        this.id = id
        this.description = description
        this.value = value
        this.percentage = percentage // -1
    }
    
    /* Expense.prototype.calcPercentage = function(totalIncome){
        if (totalIncome > 0){
        this.percentage = Math.round((this.value / totalIncome) * 100)
        } else {
            this.percentage = -1
        }
    }
    
    Expense.prototype.getPercentage = function(){
        return this.percentage 
    }
    
    */
    
    // Function Constructor for Income Objects
    var Income = function(id, description, value){
        this.id = id
        this.description = description
        this.value = value
    }

    var calculateTotal = function(type){
        var sum = 0
        
        data.allItems[type].forEach(function(current){
            sum += current.value
        })
        data.totals[type] = sum
    }
    
    // creating proper data structure
    var data = {
        allItems: {
            // name these the same as the type to avoid having to use if/else statements to asign new items
            expense: [],
            income: []
        },
        totals: {
            expense: 0,
            income: 0
        }, 
        budget: 0,
        percentage: -1
    }
    
    return {
        addItem: function(type, des, val){
            
            var newItem, ID // initiate variables together where necessary to clean up code 
            
            // could also use "ID = income[income.length - 1].id + 1", and then the same thing but for expense, and check to see which one needs to be used, but this way makes it more versatile and without if else statements vvv try to make it as automated as possible to prevent having a bunch of if else statements and similar repeated code.
            if (data.allItems[type].length > 0){
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1 // create new ID
            }  else {
                ID = 0
            }
            
            //[1 2 3 4 5], next ID = 6
            //[1 2 4 6 8], next ID = 9
            // ID = last ID + 1
            
            // create new item based on "income" or "expense" type
            if (type === "expense"){
                newItem = new Expense(ID, des, val, (Math.round((val/data.totals.income) * 100)))
            } else if (type === "income"){
                newItem = new Income(ID, des, val)
            }
            
            // because we have named the types expenses and incomes the same as our arrays, it prevents us from having to use if/else statements to put the item in the proper array!!!!****!!!!****!!!!****!!!!****!!!!****!!!!****!!!!****!!!!****!!!!
            data.allItems[type].push(newItem) // push adds item at end of array
            
            document.getElementById("description").focus()
            
            return newItem
            
            
        }, // REMEMBER THAT RETURN FUNCTIONS NEED TO HAVE A COMMA AT THE END 
        
        
        deleteItem: function(type, id){
            
            var ids, index
            // id = 3
            // WRONG = data.allItems[type][id]
            // ids = [1 2 4 (6) 8] YOU WOULD DELETE 6 instead of 3 because they are out of order
            // if looking for the id 6, then you would use index 3
            
            ids = data.allItems[type].map(function(current){
                
                return current.id
                
            })
            
            index = ids.indexOf(id)
            
            if (index !== -1){
                data.allItems[type].splice(index, 1)
            }
            
        },
        
        
        calculateBudget: function(){
            
          // calculate total income and expenses
          calculateTotal("expense")
          calculateTotal("income")
            
          // calculate budget: income - expenses
          data.budget = data.totals.income - data.totals.expense
            
          // calculate the % of income that we spent
          if (data.totals.income > 0){
          data.percentage = Math.round((data.totals.expense / data.totals.income) * 100)
          } else {
              data.percentage = -1
            
          }
        },
        
        
        getBudget: function(){
          
            return {
                budget: data.budget,
                totalIncome: data.totals.income,
                totalExpenses: data.totals.expense,
                percentage: data.percentage
            }
            
        },
        
        
        testing: function(){ // just for testing purposes
            console.log(data)
        }
    }
    
})()


//-------------------------------------------------------------------------------------------


// UI CONTROLLER
var UIController = (function(){ // IFFE ENCAPSULATION
   
    // making it easy to change UI classes and have it make it easier later on if the names are to be changed (again, more work up front to save headaches later on)
    var DOMstrings = { // object literal style
        inputType: ".add__type",
        inputDescription: ".add__description",
        inputValue: ".add__value",
        inputButton: ".add__btn",
        incomeContainer: ".income__list",
        expenseContainer: ".expenses__list",
        budgetLabel: ".budget__value",
        incomeLabel: ".budget__income--value",
        expenseLabel: ".budget__expenses--value",
        percentageLabel: ".budget__expenses--percentage",
        container: ".container",
        dateLabel: ".budget__title--month"
        
    }
    
    var nodeListForEach = function(list, callback){
        for (var i = 0; i < list.length; i++){
            callback(list[i], i)
        }
    }
    
    return {
        getInput: function(){
            return{
                type: document.querySelector(DOMstrings.inputType).value, // will be either income or expense
                description: document.querySelector(DOMstrings.inputDescription).value,
                value: parseFloat(document.querySelector(DOMstrings.inputValue).value)
            }
        }, // DONT FORGET THIS COMMA !!!!! goes at the end of every return statement
        
        addListItem: function(obj, type){
            
            var html, newHtml, element
            
            if (type === "expense"){
                element = DOMstrings.expenseContainer
                 // create HTML string with placeholder text
                 html = '<div class="item clearfix" id="expense-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">- $%value%</div><div class="item__percentage">%percentage%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>' // used single quotes because there are double quotes used inside
            } else if (type === "income"){
                element = DOMstrings.incomeContainer
                html = '<div class="item clearfix" id="income-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">+ $%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
            }
            
            
            // replace the placeholder text with some actual data
            newHtml = html.replace("%id%", obj.id)
            newHtml = newHtml.replace("%description%", obj.description)
            newHtml = newHtml.replace("%value%", obj.value)
            newHtml = newHtml.replace("%percentage%", (obj.percentage + "%"))
            // Insert the HTML into the DOM
            document.querySelector(element).insertAdjacentHTML("beforeend", newHtml)
            
            
        },
        
        deleteListItem: function(selectorID) {
          
            var el = document.getElementById(selectorID)
            el.parentNode.removeChild(el)
            
        },
        
        clearFields: function(){
            
            var fields, fieldsArr
            
            fields = document.querySelectorAll(DOMstrings.inputDescription + ", " + DOMstrings.inputValue)
            
            fieldsArr = Array.prototype.slice.call(fields) // tricks the slice method to work with a list to turn it into an array
            
            fieldsArr.forEach(function(current, index, array){ // advanced for loops
                current.value = ""
            })
            
        },
        
        displayBudget: function(obj){
            
            if (obj.budget > 0){
                document.querySelector(DOMstrings.budgetLabel).textContent = "+ $" + Math.abs(obj.budget)
            } else if (obj.budget < 0){
                document.querySelector(DOMstrings.budgetLabel).textContent = "- $" + Math.abs(obj.budget)
            } else {
                document.querySelector(DOMstrings.budgetLabel).textContent = "---"
            }
            
            if (obj.totalIncome > 0){
                document.querySelector(DOMstrings.incomeLabel).textContent = "+ $" + obj.totalIncome
            } else {
                document.querySelector(DOMstrings.incomeLabel).textContent = "---"
            }
                
            if (obj.totalExpenses > 0){
            document.querySelector(DOMstrings.expenseLabel).textContent = "- $" + obj.totalExpenses
            } else {
                document.querySelector(DOMstrings.expenseLabel).textContent = "---"
            }
        
            if (obj.percentage > 0) {
                document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage + "%"
            } else {
                document.querySelector(DOMstrings.percentageLabel).textContent = "---"
            }
        },
        
        displayMonth: function(){ // fix with an array later
            
            var now, year, months, month
            
            now = new Date()
            
            year = now.getFullYear()
            
            months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
            
            month = months[now.getMonth()]
            
            document.querySelector(DOMstrings.dateLabel).textContent = month + " " + year
            
        },
        
        changedType: function(){ // turn the fields and button red when expense and green when income
            
            var fields = document.querySelectorAll(
                DOMstrings.inputType + "," +
                DOMstrings.inputDescription + "," +
                DOMstrings.inputValue)
            
            nodeListForEach(fields, function(current){
                current.classList.toggle("red-focus")
            })
            
            document.querySelector(DOMstrings.inputButton).classList.toggle("red")
            
        },
        
        getDOMstrings: function(){ // DOMstrings GETTER method
            return DOMstrings
        }
    }
    
})()


//-------------------------------------------------------------------------------------------


// GLOBAL APP CONTROLLER
var controller = (function(budgetCtrl, UICtrl){ // IFFE ENCAPSULATION
   
    // TRY TO SETUP METHODS FOR SIMILAR ITEMS AND TASKS FOR ORGANIZATION AND MODULATION
    
    var setupEventListeners = function(){ 
        
        var DOM = UICtrl.getDOMstrings() // how to call methods from different controllers
        
        // for when the add button is clicked
        document.querySelector(DOM.inputButton).addEventListener("click", ctrlAddItem)

        // for when enter is pressed
        document.addEventListener("keypress", function(event){

            // the which method is only used incase old browsers do not support the .keycode method, each key on a keyboard has a unique keycode number, 13 is the enter key
            if (event.keyCode === 13 || event.which === 13){

                ctrlAddItem() // call the add item function

            }
        })
        
        document.querySelector(DOM.container).addEventListener("click", ctrlDeleteItem)
        
        document.querySelector(DOM.inputType).addEventListener("change", UICtrl.changedType)
        
    }
    
    var updateBudget = function(){
        
        // 1. Calculate the budget
        budgetCtrl.calculateBudget()
        
        // 2. Return the budget
        var budget = budgetCtrl.getBudget()
        
        // 3. Display the budget on the UI
        UICtrl.displayBudget(budget)
        
    }
    
    var ctrlAddItem = function(){
        
        var input, newItem // again to clean up code, initialize possible variables at once
        
        // 1. Get the field input data
        input = UICtrl.getInput() // accessing method from UI controller
        
        if (input.description !== "" && input.value !== "" && !isNaN(input.value) && input.value > 0){
        // 2. Add item to the budget controller
        newItem = budgetCtrl.addItem(input.type, input.description, input.value)
        
        // 3. Add the item to the UI
        UICtrl.addListItem((newItem), input.type)
        }
            
        // 4. Clear the fields
        UICtrl.clearFields()
        
        // 5. Calculate and update budget
        updateBudget()

        
    }
    
    var ctrlDeleteItem = function(event){
        
        var itemID, splitID, type, ID
        
        itemID = event.target.parentNode.parentNode.parentNode.parentNode.id
        
        console.log(itemID)
        
        if (itemID) {
            
            // income-1
            splitID = itemID.split("-")
            type = splitID[0]
            ID = parseInt(splitID[1])
            
            // 1. Delete the item from the data structure
            budgetCtrl.deleteItem(type, ID)
            
            // 2. Delete the item from the UI
            UICtrl.deleteListItem(itemID)
            
            // 3.Update and show the new budget
            updateBudget()
            
        }
        
    }
    
    
    return{ // ALWAYS USE AN INIT FUNCTION TO START THE APP vvvvv HAVE TO CALL IT OUTSIDE OF THE MODULES, ONLY THING THAT GOES OUTSIDE OF A MODULE!
        init: function(){
            console.log("Application has started.")
            setupEventListeners()
            UICtrl.displayMonth()
        }
    } ///// APARENTLY DONT NEED A COMMA ON THE LAST RETURN? GO FIGURE
    
})(budgetController, UIController) // using the other modules used in the application as parameters to be able to access them through this main controller module

controller.init() // always have to call init function outside of the modules















