var mathOperators =  {
    '+': function(x,y){ return x + y},
    '-': function(x,y){ return x - y},
    '/': function(x,y){ return x / y},
    '*': function(x,y){ return x * y}
}

var calculator = {
    lastFunction: {},
    arrayOfInputValues: [],
    displayScreen: [],
    lastOperatorUsed: "",
}

$(document).ready(initializeApp);

function initializeApp(){
  $('.number').on('click', calculator.pressNumberButton.bind(calculator));
  $('.clear').on('click', calculator.clearCalculator.bind(calculator, "0"));
  $('.clearEntry').on('click', calculator.clearLastInput.bind(calculator));
  $('.operand').on('click', calculator.pressOperandButton.bind(calculator));
  $('.equal').on('click', calculator.calculate.bind(calculator));
  $('.decimal').on('click', calculator.addDecimalToNumber.bind(calculator));
}

//objective: calculate user input, call filterArray, call getSumOfInput, call displayOnCalculator
//return: none
calculator.calculate = function(){
    var lastValueInArray = this.arrayOfInputValues[this.arrayOfInputValues.length - 1];
    var result;
   if(this.arrayOfInputValues.length === 0){
     return;
   }

   //if the input is a number, push operand and value of last function
   if(this.arrayOfInputValues.length === 1 && this.lastFunction.operand){
     var addOperatorToEquation = new Value('operand',this.lastFunction.operand );
     var addSumToEquation = new Value('number', this.lastFunction.num2);
    this.arrayOfInputValues.push(addOperatorToEquation, addSumToEquation);
   }

   //if last input is operator, pop and store
   if(lastValueInArray.type === "operand"){
     this.lastOperatorUsed = this.arrayOfInputValues.pop();
   }
   this.arrayOfInputValues = this.filterArray();
   result = getSumOfInput(calculator.arrayOfInputValues);
   if(!result){
     return;
   }

   //if last value is operand, push last operand and sum of equation and concat, calling sumofINput
   if(lastValueInArray.type === "operand"){
     var operand = this.lastOperatorUsed;
     var sum = new Value('number', result);
     this.arrayOfInputValues.push(operand, sum);
     result = getSumOfInput(this.arrayOfInputValues);
   }
   this.displayScreen = [result]
   displayOnCalculator();
}

//objective: take an array with all inputs and remove double operators and join numbers
//return: array
calculator.filterArray = function(){
  var filteredInput = [];
  var index = 0;
  //remove first value and store
  var previousValue = this.arrayOfInputValues.shift();
  filteredInput.push(previousValue);
  var currentvalue;
  while(this.arrayOfInputValues.length){
    currentvalue = this.arrayOfInputValues[index];
    if(previousValue.type === 'number' && currentvalue.type === 'number') {
        var number = filteredInput.pop();
        currentvalue = new Value('number',  number.value + currentvalue.value);
    }
    else if (previousValue.type === 'operand' && currentvalue.type === 'operand'){
        filteredInput.pop();
    }
    filteredInput.push(currentvalue);
    var previousValue = this.arrayOfInputValues.shift();
  }
  return filteredInput;
}

calculator.pressNumberButton =  function(){
  var number = $(event.target).text();
    var newValue = new Value('number', number);
    this.arrayOfInputValues.push(newValue);
    this.displayScreen.push(number)
    displayOnCalculator();
}

calculator.pressOperandButton = function(){
  if(this.arrayOfInputValues.length === 0){
      return
    }
    var operand = $(event.target).val();
    var newValue = new Value('operand', operand);
    //if the last screen value is operator, pop and add new
    var lastInput = this.arrayOfInputValues[this.arrayOfInputValues.length - 1];
    if(lastInput.type === 'operand'){
      this.displayScreen.pop();
    }
    this.arrayOfInputValues.push(newValue);
    this.displayScreen.push(operand);
    displayOnCalculator();
}

calculator.addDecimalToNumber = function (){
  var newNumber = new Value('number', ".");
   this.arrayOfInputValues.push(newNumber);
   this.displayScreen.push(".")
   displayOnCalculator();

}

calculator.clearLastInput = function(){
  var lastValue = this.arrayOfInputValues.pop();
  this.displayScreen.pop();
  displayOnCalculator();
}

calculator.clearCalculator = function(){
  this.lastFunction = {},
  this.arrayOfInputValues = [],
  this.displayScreen = [],
  this.lastOperatorUsed = "",
  displayOnCalculator();
}

function Value(type, value) {
  this.type = type,
  this.value = value
}


function getSumOfInput(array){
  //if the input is 1 number, return the number
  if(array.length === 1){
    return array[0].value;
  }
  var result = calculateEquation(array);
  if(result === "Infinity"){
    calculator.clearCalculator();
    $('.input').text('error');
    return false;;
  }
  else {
    calculator.currentNumber = result;
  }
  return result;
}

//objective: calculate input equation using order of orderOfOperations
//return: result as a string
function calculateEquation(array){
  var orderOfOperations = ['*', "/", "+", "-"];
  var equation;
  var num2;
  var operandIndex = 0;

  while(operandIndex < orderOfOperations.length){
    for(var i=0 ; i< array.length ; i++){
      if(array[i].value === orderOfOperations[operandIndex]){
        //get values before and after
        var operator = array[i].value;
        var num1 = parseFloat(array[i-1].value);
        num2 = parseFloat(array[i+1].value);
        equation = mathOperators[operator](num1, num2);
        if(equation.toString().length > 6){
          // equation = equation.toExponential();
          equation = equation.toPrecision(6);

        }
        equation = equation.toString();
        var answer = new Value('number', equation);
        array.splice(i-1, 3, answer);
        i = i-1;
      }
    }
    operandIndex++;
  }
  calculator.lastFunction.operand = operator;
  calculator.lastFunction.num2 = num2;
  calculator.currentOperator = "";
  return equation;
}


function displayOnCalculator(){
  if(calculator.displayScreen.length === 0){
    $('.input').text("0");
    return;
  }
  $('.input').text(calculator.displayScreen.join(""));
}
