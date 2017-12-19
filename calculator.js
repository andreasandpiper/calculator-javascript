
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
  currentNumber: null,
  buttonValue: [],
  clearCalculation: function(){
    this.buttonValue = [];
  },
  calculate: function(){
    var newValue = new Value('number', this.currentNumber);
    this.buttonValue.push(newValue);
    this.currentNumber = null;
    for(var i=0 ; i< this.buttonValue.length ; i++){
      if(this.buttonValue[i].type === 'operand' && this.buttonValue[i+1]){
        //get values before and after
        var operator = this.buttonValue[i].value;
        var num1 = parseInt(this.buttonValue[i-1].value);
        var num2 = parseInt(this.buttonValue[i+1].value);
        var equation = calculator.mathOperators[operator](num1, num2);
        this.buttonValue.splice(i-1, 3);
        var answer = new Value('number', equation);
        this.buttonValue[i-1] = answer;
      }
      $('.input').text(this.buttonValue[0].value);
      calculator.screen = [equation];
    }
  }
};

$(document).ready(initializeApp);

function initializeApp(){
  $('.number').on('click', getNumberValue);
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
  var newValue = new Value('operand', item);
  displayOnCalculator(item);
  calculation.buttonValue.push(newValue);
}
