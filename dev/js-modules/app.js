(function () {
    var MAX_VALUE = 100,
        MIN_VALUE = 0,
        MAX_SCALE = 2,
        root = document.querySelector(".body-wrapper");

    function randomInteger(min, max) {
        var rand = min - 0.5 + Math.random() * (max - min + 1)
        rand = Math.round(rand);
        return rand;
    }

    function Element(value) {

        if (value == undefined) {
            console.log("value is undefined");
            return;
        }

        if (value < MIN_VALUE) value = MIN_VALUE;
        if (value > MAX_VALUE) value = MAX_VALUE;

        let el = document.createElement("div");
        el.classList = "element";
        el.textContent = value;

        let scale = 1 + (MAX_SCALE * value/100);
        el.style.width = 5 * scale + 'rem';
        el.style.height = 5 * scale + 'rem';
        el.style.lineHeight = 5 * scale + 'rem';
        return el;
    }

    function Chain(length) {
        let numbers = [],
            elements = [];
        outer: for (var i = 0; i < length;){
            var number = randomInteger(MIN_VALUE, MAX_VALUE);
            for (let k = 0; k < numbers.length; k++){
                if (numbers[k] === number) continue outer;
            }
            numbers.push(number);
            i++;
        }
        for (let i = 0; i < length; i ++){
            let el = new Element(numbers[i]);
            elements.push(el);
            root.appendChild(el);
        }

        function choose(index) {
            elements[index].classList = "element--active";
            elements[index + 1].classList = "element--active";
        }
        
        function iterate() {
            var index = 0;
            let promise = new Promise((resolve, reject) => {

                let resolveTimer = setTimeout(() => {
                    choose(index++);
                    clearTimeout(rejectTimer);
                    resolve("result");
                }, 1000);
                let rejectTimer = setTimeout(() => {
                    console.log("reject");
                    clearTimeout(resolveTimer);
                }, 2000);

            }).then(
                result => {

                },
                error => {
                    console.log("Rejected: " + error);
                }
            );
        }
        iterate();

    }

    let chain = new Chain(10);

})();