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

// var Calculation = {
//
// }

var calculator = {
  currentNumber: null,
  currentOperator: null,
  arrayOfValues: [],
  displayScreen: [],
  clearCalculator: function(){
    this.arrayOfValues = [];
    this.currentNumber = null;
    this.currentOperator = null;
    $('.input').text("");
    calculator.displayScreen = [];
  },
  calculate: function(){
    var newValue = new Value('number', this.currentNumber);
    this.arrayOfValues.push(newValue);
    this.currentNumber = null;
    for(var i=0 ; i< this.arrayOfValues.length ; i++){
      // var answer = getAnswer()
      // debugger;
      if(this.arrayOfValues[i].type === 'operand' && this.arrayOfValues[i+1]){
        //get values before and after
        var operator = this.arrayOfValues[i].value;
        var num1 = parseFloat(this.arrayOfValues[i-1].value);
        var num2 = parseFloat(this.arrayOfValues[i+1].value);
        var equation = mathOperators[operator](num1, num2);
        var answer = new Value('number', equation);
        this.arrayOfValues.splice(i-1, 3, answer);
        i = i-1;
        // this.arrayOfValues[i-1] = answer;
      }

      if(equation === "Infinity"){
        $('.input').text("error");
        this.currentNumber = null;
        calculator.displayScreen = [];
      } else {
        this.currentNumber = equation;
        $('.input').text(equation);
        calculator.displayScreen = [equation];
      }
      this.currentOperator = null;
    }
  },
  pressNumberButton: function(){
    var item = $(event.target).text();
    if(this.currentOperator){
      var operator = new Value('operand', this.currentOperator);
      this.arrayOfValues.push(operator);
      this.currentOperator = null;
    }
    if(this.currentNumber){
      this.currentNumber += item;
    } else {
      this.currentNumber = item;
    }
    displayOnCalculator(item);
  },
  pressOperandButton: function(){
    if(this.currentNumber){
      var newValue = new Value('number', this.currentNumber);
      this.arrayOfValues.push(newValue);
      this.currentNumber = null;
    }
    var item = $(event.target).val();
    if(!this.currentOperator){
      displayOnCalculator(item);
    } else if (this.currentOperator != item){
      this.displayScreen.pop();
      displayOnCalculator(item);
    }
    this.currentOperator = item;
  },
  addDecimalToNumber: function (){
    if(this.currentNumber && this.currentNumber[this.currentNumber.length -1] !== '.'){
      this.currentNumber += ".";
      displayOnCalculator(".");
    }
  }
}

function getAnswer(){

}

  //idea: keep an array of operators used, sort them in order of operations and find those values


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
