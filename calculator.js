
$(document).ready(initializeApp);

function initializeApp(){
  $('.number').on('click', calculator.pressNumberButton.bind(calculator));
  $('.clear').on('click', calculator.clearCalculator.bind(calculator));
  $('.operand').on('click', calculator.pressOperandButton.bind(calculator));
  $('.equal').on('click', calculator.calculate.bind(calculator));
  $('.decimal').on('click', calculator.addDecimalToNumber.bind(calculator));
}

function displayOnCalculator(item){
  calculator.displayScreen.push(item)
  $('.input').text(calculator.displayScreen.join(""));
}

var mathOperators =  {
    '+': function(x,y){ return x + y},
    '-': function(x,y){ return x - y},
    '/': function(x,y){ return x / y},
    '*': function(x,y){ return x * y}
}

function Value(type, value) {
  this.type = type,
  this.value = value
}

var calculator = {
  lastFunction: {},
  currentNumber: null,
  currentOperator: null,
  arrayOfInputValues: [],
  displayScreen: [],
  clearCalculator: function(){
    this.arrayOfInputValues = [];
    this.currentNumber = null;
    this.currentOperator = null;
    $('.input').text("");
    calculator.displayScreen = [];
  },
  calculate: function(){
    // debugger;
    if(this.arrayOfInputValues.length === 1 && this.lastFunction.operand){
        //take the first item in arrayOfInputValues
        var currentSum = parseFloat(this.arrayOfInputValues[0].value)
        var answer = mathOperators[this.lastFunction.operand]( currentSum, this.lastFunction.num2);
        var newInput = new Value('number', answer);
        this.arrayOfInputValues.pop();
        this.arrayOfInputValues.push(newInput);
        this.displayScreen.pop();
        displayOnCalculator(answer);
    } else if(this.arrayOfInputValues[this.arrayOfInputValues.length -1].type === 'operand'){
      // debugger;
      var operator = this.arrayOfInputValues.pop();
      if(this.arrayOfInputValues.length !== 1){
        getSumOfInput();
      }
      var result = mathOperators[operator.value](this.arrayOfInputValues[0].value, this.arrayOfInputValues[0].value);
      var createResultObject = new Value('number', result);
      this.arrayOfInputValues = [createResultObject];
      this.displayScreen = [];
      this.lastFunction.operand = operator.value;
      this.lastFunction.num2 = result;
      displayOnCalculator(result);
    } else {
      getSumOfInput();
    }
  },
  pressNumberButton: function(){
    var item = $(event.target).text();
    if(this.currentNumber){
      if(this.currentNumber[this.currentNumber.length -1] !== "."){
        this.displayScreen.pop();
      }
      this.currentNumber += item;
      this.arrayOfInputValues.pop();
    } else {
      this.currentNumber = item;
    }
    var newValue = new Value('number', this.currentNumber);
    this.arrayOfInputValues.push(newValue);
    displayOnCalculator(item);
    this.currentOperator = null;
  },
  pressOperandButton: function(){
    // debugger;
    this.currentNumber = null;
    var item = $(event.target).val();
    if(this.currentOperator){
      this.arrayOfInputValues.pop();
      this.displayScreen.pop();
    }
    this.currentOperator = item;
    var newValue = new Value('operand', this.currentOperator);
    this.arrayOfInputValues.push(newValue);
    displayOnCalculator(item);
  },
  addDecimalToNumber: function (){
    if(this.currentNumber && this.currentNumber[this.currentNumber.length -1] !== '.'){
      this.currentNumber += ".";
      displayOnCalculator(".");
    }
  }
}
  //idea: keep an array of operators used, sort them in order of operations and find those values
function getSumOfInput(){
  for(var i=0 ; i< calculator.arrayOfInputValues.length ; i++){
    if(calculator.arrayOfInputValues[i].type === 'operand' ){
      //get values before and after
      var operator = calculator.arrayOfInputValues[i].value;
      var num1 = parseFloat(calculator.arrayOfInputValues[i-1].value);
      var num2 = parseFloat(calculator.arrayOfInputValues[i+1].value);
      var equation = mathOperators[operator](num1, num2);
      var answer = new Value('number', equation);
      calculator.arrayOfInputValues.splice(i-1, 3, answer);
      i = i-1;
    }

    if(equation === "Infinity"){
      $('.input').text("error");
      calculator.currentNumber = null;
      calculator.displayScreen = [];
    } else {
      calculator.currentNumber = equation;
      $('.input').text(equation);
      calculator.displayScreen = [equation];
    }
    calculator.lastFunction.operand = operator;
    calculator.lastFunction.num2 = num2;
    calculator.currentOperator = null;
  }
  return equation;
}
