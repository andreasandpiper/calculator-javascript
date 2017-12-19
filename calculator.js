
var calculator = {
  screen: [],
  mathOperators: {
    '+': function(x,y){ return x + y},
    '-': function(x,y){ return x - y},
    '/': function(x,y){ return x / y},
    '*': function(x,y){ return x * y}
  },
}

var calculation = {
  //idea: keep an array of operators used, sort them in order of operations and find those values
  currentNumber: null,
  currentOperator: null,
  buttonValue: [],
  clearCalculation: function(){
    this.buttonValue = [];
    this.currentNumber = null;
    this.currentOperator = null;
    $('.input').text("");
    calculator.screen = [];
  },
  calculate: function(){
    var newValue = new Value('number', this.currentNumber);
    this.buttonValue.push(newValue);
    this.currentNumber = null;
    for(var i=0 ; i< this.buttonValue.length ; i++){
      // debugger;
      if(this.buttonValue[i].type === 'operand' && this.buttonValue[i+1]){
        //get values before and after
        var operator = this.buttonValue[i].value;
        var num1 = parseInt(this.buttonValue[i-1].value);
        var num2 = parseInt(this.buttonValue[i+1].value);
        var equation = calculator.mathOperators[operator](num1, num2);
        var answer = new Value('number', equation);
        this.buttonValue.splice(i-1, 3, answer);
        i = i-1;
        // this.buttonValue[i-1] = answer;
      }
      this.currentNumber = equation;
      this.currentOperator = null;
      calculator.screen = [equation];
      $('.input').text(equation);
    }
  }
};

$(document).ready(initializeApp);

function initializeApp(){
  $('.number').on('click', getNumberValue);
  $('.clear').on('click', calculation.clearCalculation.bind(calculation));
  $('.operand').on('click', getOperandValue);
  $('.equal').on('click', calculation.calculate.bind(calculation));
}

function Value(type, value) {
  this.type = type,
  this.value = value
}

function displayOnCalculator(item){
  calculator.screen.push(item)
  $('.input').text(calculator.screen.join(""));
}

function getNumberValue(){
  var item = $(this).text();
  if(calculation.currentOperator){
    var operator = new Value('operand', calculation.currentOperator);
    calculation.buttonValue.push(operator);
    calculation.currentOperator = null;
  }
  if(calculation.currentNumber){
    calculation.currentNumber += item;
  } else {
    calculation.currentNumber = item;
  }
  displayOnCalculator(item);
}

function getOperandValue(){
  if(calculation.currentNumber){
    var newValue = new Value('number', calculation.currentNumber);
    calculation.buttonValue.push(newValue);
    calculation.currentNumber = null;
  }
  var item = $(this).val();
  if(!calculation.currentOperator){
    displayOnCalculator(item);
  } else if (calculation.currentOperator != item){
    calculator.screen.pop();
    displayOnCalculator(item);
  }
  calculation.currentOperator = item;
}
