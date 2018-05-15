import React, { Component } from 'react';
import Stars from "./Stars";
import Button from "./Button";
import Answer from "./Answer";
import Numbers from "./Numbers";
import DoneFrame from "./DoneFrame";

var possibleCombinationSum = function (arr, n) {
    if (arr.indexOf(n) >= 0) { return true; }
    if (arr[0] > n) { return false; }
    if (arr[arr.length - 1] > n) {
        arr.pop();
        return (() => possibleCombinationSum(arr, n));
    }
    var listSize = arr.length, combinationsCount = (1 << listSize)
    for (var i = 1; i < combinationsCount; i++) {
        var combinationSum = 0;
        for (var j = 0; j < listSize; j++) {
            if (i & (1 << j)) { combinationSum += arr[j]; }
        }
        if (n === combinationSum) { return true; }
    }
    return false;
}

class Game extends Component {

    static randomNumber = () => 1 + Math.floor(Math.random() * 9);
    static initialState = () => ({
        selectedNumbers: [],
        usedNumbers: [],
        randomNumberOfStars: Game.randomNumber(),
        answerIsCorrect: null,
        redraws: 5,
        doneStatus: null,
    });

    state = Game.initialState();

    selectNumber = (clickedNumber) => {
        //If clicked number is in selected Number, skip.
        if (this.state.selectedNumbers.indexOf(clickedNumber) < 0) {
            this.setState(prevState => ({
                answerIsCorrect: null,
                selectedNumbers: prevState.selectedNumbers.concat(clickedNumber)
            }));
        }
    };

    unselectNumber = (clickedNumber) => {
        this.setState(prevState => ({
            answerIsCorrect: null,
            selectedNumbers: prevState.selectedNumbers
                                      .filter(number => number !== clickedNumber)
        }));
    };

    checkAnswer = () => {
        this.setState(prevState => ({
            answerIsCorrect: prevState.randomNumberOfStars ===
                prevState.selectedNumbers.reduce((accumulator, currentValue) => accumulator + currentValue, 0)
        }));
    };

    acceptAnswer = () => {
        this.setState(prevState => ({
            usedNumbers: prevState.usedNumbers.concat(prevState.selectedNumbers),
            answerIsCorrect: null,
            selectedNumbers: [],
            randomNumberOfStars: Game.randomNumber(),
        }), this.updateDoneStatus);    
    };

    redraw = () => {
        if (this.state.redraws === 0) {
            return;
        }
        this.setState(prevState => ({
            randomNumberOfStars: Game.randomNumber(),
            answerIsCorrect: null,
            selectedNumbers: [],
            redraws: prevState.redraws - 1,           
        }), this.updateDoneStatus); 
    };

    possibleSolution = ({randomNumberOfStars, usedNumbers}) => {
        const list = [1, 2, 3, 4, 5, 6, 7, 8, 9];
        const possibleNumbers = list.filter(number => 
            usedNumbers.indexOf(number) === -1
        );
        return possibleCombinationSum(possibleNumbers, randomNumberOfStars);
    };

    updateDoneStatus = () => {
        this.setState(prevState => {
            if (prevState.usedNumbers.length === 9) {
                return { doneStatus: 'You Win, Good Job!'};
            } 
            if (prevState.redraws === 0 && !this.possibleSolution(prevState)) {
                return {doneStatus: 'Game Over!'};
            }
        });
    };

    playAgain = () => {
        this.setState(
            Game.initialState()
        );
    };

    render() {
        const { 
            selectedNumbers, 
            randomNumberOfStars,
            answerIsCorrect,
            usedNumbers,
            redraws,
            doneStatus,
         } = this.state;
        return (
            <div className="container">
                <h3>Play Nine</h3>
                <hr />
                <div className="row">
                    <Stars numberOfStars = {randomNumberOfStars} />
                    <Button selectedNumbers = {selectedNumbers} 
                            checkAnswer = {this.checkAnswer} 
                            answerIsCorrect = {answerIsCorrect}
                            acceptAnswer= {this.acceptAnswer}
                            redraws = {redraws}
                            redraw = {this.redraw}/>
                    <Answer selectedNumbers = {selectedNumbers} 
                            unselectNumber = {this.unselectNumber} /> 
                </div>
                <br />
                {
                    doneStatus ?
                        <DoneFrame doneStatus = {doneStatus} 
                                   playAgain = {this.playAgain}/> :
                        <Numbers selectedNumbers = {selectedNumbers}
                            selectNumber = {this.selectNumber}
                            usedNumbers = {usedNumbers} />
                }
                <br />  
            </div>
        );
    }
}

export default Game;