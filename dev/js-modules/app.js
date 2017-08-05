(function () {
    var MAX_VALUE = 100,
        MIN_VALUE = 0,
        MAX_SCALE = 2,
        START_ITERATION = 0,
        index,
        root = document.querySelector(".body-wrapper");

    function randomInteger(min, max) {
        var rand = min - 0.5 + Math.random() * (max - min + 1)
        rand = Math.round(rand);
        return rand;
    }

    function Element(value) {
        let el;

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

            let scale = 1 + (MAX_SCALE * value/100);
            el.style.width = 5 * scale + 'rem';
            el.style.height = 5 * scale + 'rem';
            el.style.lineHeight = 5 * scale + 'rem';
            return el;
        };

        this.select = function () {
            el.classList = "element--active";
        };
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
        
        function iterate(index) {
            if (index >= length - 1) return;
            let promise = new Promise((resolve, reject) => {

                let resolveTimer = setTimeout(() => {
                    select(index);
                    clearTimeout(rejectTimer);
                    index++;
                    resolve("result");
                }, 1000);
                let rejectTimer = setTimeout(() => {
                    console.log("reject");
                    clearTimeout(resolveTimer);
                }, 2000);

            }).then(
                result => {
                    iterate(index);
                },
                error => {
                    console.log("Rejected: " + error);
                }
            );
        }
        iterate(0);

    }

    let chain = new Chain(10);

})();