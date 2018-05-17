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
        redraws: 3,
        doneStatus: null,
        giftClassColor: null,
        difficultMode: false,
    });

    static difficultState = () => ({
        selectedNumbers: [],
        usedNumbers: [],
        randomNumberOfStars: Game.randomNumber(),
        answerIsCorrect: null,
        redraws: 1,
        doneStatus: null,
        giftClassColor: null,
        difficultMode: true,
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
            if (prevState.usedNumbers.length === 9 && this.state.difficultMode === false) {
                return { 
                    doneStatus: 'You Win! I have a small gift for you~ Good Job!',
                    giftClassColor: 'gift-grey'
                };
            } 
            if (prevState.usedNumbers.length === 9 && this.state.difficultMode === true) {
                return { 
                    doneStatus: 'Awesome Baby! Give me a kiss, I will show you second gift!!',
                    giftClassColor: 'gift-green'
                };
            } 
            if (prevState.redraws === 0 && !this.possibleSolution(prevState)) {
                return {doneStatus: 'Game Over! No Gift~~~'};
            }
        });
    };

    playAgain = () => {
        this.setState(
            Game.initialState()
        );
    };

    playDifficult = () => {
        this.setState(
            Game.difficultState()
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
            giftClassColor,
         } = this.state;
        return (
            <div className="container">
                <h3 className="text-danger">Heart Game</h3>
                <p><b>How to play:</b></p>
                <p>1. Select number or numbers equal to hearts.</p>
                <p>2. Click "=" button to check if answer is correct.</p>
                <p>3. Click refresh button if you run out of choice.</p>
                <p>4. Use all numbers to win the game!</p>
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
                <hr />
                <br />
                {
                    doneStatus ?
                        <DoneFrame doneStatus = {doneStatus} 
                                   giftClassColor={giftClassColor}
                                   playAgain = {this.playAgain}
                                   playDifficult = {this.playDifficult} /> :
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