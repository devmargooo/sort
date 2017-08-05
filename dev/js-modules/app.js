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

        this.getLeftInitial = function () {
            return el.getBoundingClientRect().left;
        };

        this.moveRight = function (distance) {
            let promise = new Promise((resolve, reject) => {

                leftInitial = self.getLeftInitial();
                console.log('initial' + leftInitial);

                let speed = 500;

                let start = Date.now();
                let timer = setInterval(function() {
                    let timePassed = Date.now() - start;
                    if (timePassed >= speed) {
                        clearInterval(timer);
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
                console.log('initial' + leftInitial);

                let speed = 500;

                let start = Date.now();
                let timer = setInterval(function() {
                    let timePassed = Date.now() - start;
                    if (timePassed >= speed) {
                        clearInterval(timer);
                        resolve('result');
                    }

                    drowMovingLeft(timePassed, distance);

                }, speed/50);

            });
            return promise;
        };

        function drowMovingRight(timePassed, distance) {

            if (leftInitial === undefined) return;
            let coord = distance*0.002*timePassed + 'px';
            el.style.left = coord;

        };

        function drowMovingLeft(timePassed, distance) {

            if (leftInitial === undefined) return;
            let coord = -distance*0.002*timePassed + 'px';
            console.log(coord);
            el.style.left = coord;

        }
    }

    function Chain(length) {
        let numbers = [],
            elements = [];
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
            let biggerLeft = elements[index].getLeftInitial();
            let smallerLeft = elements[index + 1].getLeftInitial();
            console.log(biggerLeft);
            console.log(smallerLeft);

            if (biggerLeft >= smallerLeft) return;

            let distance = smallerLeft - biggerLeft;
            elements[index].moveRight(distance);
            elements[index+1].moveLeft(distance);
        }
        
        function iterate(index) {
            if (index >= length - 1) return;
            let promise = new Promise((resolve, reject) => {

                let rejectTimer = setTimeout(() => {
                    console.log("reject");
                    clearTimeout(resolveTimer);
                }, 5000);

                select(index);
                if (elements[index].getValue() > elements[index + 1].getValue()){
                    bubble(index);
                    return;
                    //console.log(elements[index].getValue() + ' > ' + elements[index + 1].getValue());
                } else {
                    console.log(elements[index].getValue() + ' <= ' + elements[index + 1].getValue());
                }

                clearTimeout(rejectTimer);
                index++;
                resolve("result");

            }).then(
                result => {
                    iterate(index);
                },
                error => {
                    console.log("Rejected: " + error);
                }
            );
        }
        this.test = function(){
            iterate(0);
        }


    }

    let chain = new Chain(10);
    var timer = setTimeout(function () {
        chain.test();
    }, 4000);

})();