(function () {
    var MAX_VALUE = 100,
        MIN_VALUE = 0,
        MAX_SCALE = 2,
        INITIAL_SIZE = 6,
        START_ITERATION = 0,
        index,
        root = document.querySelector(".body-wrapper");

    function randomInteger(min, max) {
        var rand = min - 0.5 + Math.random() * (max - min + 1)
        rand = Math.round(rand);
        return rand;
    }

    function Element(value) {
        let el,
            leftInitial,
            tempOffsetLeft = 0,
            offsetLeft = 0,
            self = this;

        if (value == undefined) {
            console.log("value is undefined");
            return;
        }

        if (value < MIN_VALUE) value = MIN_VALUE;
        if (value > MAX_VALUE) value = MAX_VALUE;


        this.render = function () {
            el = document.createElement("div");
            el.classList = "element";
            el.textContent = value;

            let scale = 1 + (MAX_SCALE * value/500);
            el.style.width = INITIAL_SIZE * scale + 'rem';
            el.style.height = INITIAL_SIZE * scale + 'rem';
            el.style.lineHeight = INITIAL_SIZE * scale + 'rem';
            return el;
        };

        this.getValue = function () {
          return value;
        };

        this.select = function () {
            el.classList = "element--active";
        };
        this.disactive = function () {
            el.classList = "element--sorted";
        }

        this.getLeftInitial = function () {
            return el.getBoundingClientRect().left;
        };

        this.moveRight = function (distance) {
            let promise = new Promise((resolve, reject) => {

                leftInitial = self.getLeftInitial();

                let speed = 500;

                let start = Date.now();
                let timer = setInterval(function() {
                    let timePassed = Date.now() - start;
                    if (timePassed >= speed) {
                        clearInterval(timer);
                        setTimeout(function () {
                            offsetLeft = tempOffsetLeft;
                        },10);
                        tempOffsetLeft = 0;
                        resolve('result');
                    }

                    drowMovingRight(timePassed, distance);

                }, speed/50);

            });
            return promise;
        };

        this.moveLeft = function (distance) {
            let promise = new Promise((resolve, reject) => {

                leftInitial = self.getLeftInitial();

                let speed = 500;

                let start = Date.now();
                let timer = setInterval(function() {
                    let timePassed = Date.now() - start;
                    if (timePassed >= speed) {
                        clearInterval(timer);
                        setTimeout(function () {
                            offsetLeft = tempOffsetLeft;
                        },10);
                        tempOffsetLeft = 0;
                        resolve('result');
                    }

                    drowMovingLeft(timePassed, distance);

                }, speed/50);

            });
            return promise;
        };

        function drowMovingRight(timePassed, distance) {

            if (leftInitial === undefined) return;
            var coordValue = offsetLeft + distance*0.002*timePassed;
            tempOffsetLeft = coordValue;
            let coord =  coordValue + 'px';
            el.style.left = coord;

        }

        function drowMovingLeft(timePassed, distance) {

            if (leftInitial === undefined) return;
            var coordValue = offsetLeft - distance*0.002*timePassed;
            tempOffsetLeft = coordValue;
            let coord =  coordValue + 'px';
            el.style.left = coord;
        }
    }

    function Chain(length) {

        if (length == 0) return;

        let numbers = [],
            elements = [],
            stopValue = length - 1;
        outer: for (let i = 0; i < length;){
            let number = randomInteger(MIN_VALUE, MAX_VALUE);
            for (let k = 0; k < numbers.length; k++){
                if (numbers[k] === number) continue outer;
            }
            numbers.push(number);
            i++;
        }

        for (let i = 0; i < length; i ++){
            let el = new Element(numbers[i]);
            elements.push(el);
            root.appendChild(el.render());
        }
        function clearSelection() {
            let selected = document.querySelectorAll(".element--active");
            for (let i = 0; i<selected.length; i++){
                selected[i].classList = "element";
            }
        }
        function select(index) {
            clearSelection();
            elements[index].select();
            elements[index + 1].select();
        }
        
        function bubble(index) {
            let promise = new Promise((resolve, reject) => {
                console.log("BUBBLE");

                let biggerLeft = elements[index].getLeftInitial();
                let smallerLeft = elements[index + 1].getLeftInitial();

                if (biggerLeft >= smallerLeft) return;

                let distance = smallerLeft - biggerLeft;
                let promise1 = elements[index].moveRight(distance);
                let promise2 = elements[index+1].moveLeft(distance);

                let temp = elements[index + 1];
                elements[index + 1] = elements[index];
                elements[index] = temp;

                Promise.all([promise1, promise2])
                    .then(
                        result => {
                            console.log("animation done!");
                            resolve("result");
                        },
                        error => {
                            console.log("Rejected: " + error);
                        }
                    )

            });
            return promise;

        }

        function iterate(index) {
            if (index > stopValue) {
                console.log("index is more than stopValue");
                return;
            }
            if (stopValue <= 0 || length === 1) {
                elements[0].disactive();
                return;
            }
            console.log("start with index " + index);
            let promise = new Promise((resolve, reject) => {

                let rejectTimer = setTimeout(() => {
                    console.log("reject");
                }, 5000);

                select(index);
                if (elements[index].getValue() > elements[index + 1].getValue()){
                    let promise = bubble(index)
                        .then(
                            result => {
                                console.log("bubbling ok");
                                clearTimeout(rejectTimer);
                                index++;
                                resolve("result");
                            },
                            error => {
                                console.log("Rejected: " + error);
                            }
                        );
                    return;
                } else {
                    console.log("it's not bubble");
                    clearTimeout(rejectTimer);
                    index++;
                    resolve("result");
                }

                resolve("result");

            }).then(
                result => {
                    if (index >= stopValue) {
                        clearSelection();
                        elements[stopValue].disactive();
                        stopValue--;
                        console.log("stop");
                        let iterationTimer = setTimeout(() => {
                            iterate(0);
                        }, 800);
                    }
                    let iterationTimer = setTimeout(() => {
                        console.log('next iteration');
                        iterate(index);
                    }, 800);
                },
                error => {
                    console.log("Rejected: " + error);
                }
            );
        }
        this.start = function(){

            var timer = setTimeout(function () {
                iterate(0);
            }, 800);
        }


    }

    document.querySelector(".button").onclick = function () {
        document.querySelector(".body-wrapper").innerHTML = "";
        let chain = new Chain(12);
        chain.start();
    };


})();