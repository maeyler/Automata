var Constant = /** @class */ (function () {
    function Constant(value) {
        this.num = value;
        this.name = 'Constant';
        this.map = {};
        this.map['value'] = '' + this.num;
    }
    /** Returns float value of this Expression */
    Constant.prototype.fValue = function () {
        return this.num;
    };
    /** String representation of this Expression */
    Constant.prototype.toString = function () {
        return Constant.numToStr(this.num);
    };
    /** Converts this Expression to postfix (RPN) */
    Constant.prototype.toPostfix = function () {
        return ' ' + Constant.numToStr(this.num);
    };
    Constant.numToStr = function (value) {
        var s = '' + value;
        if (s.lastIndexOf('.0') != -1) {
            s = s.substring(0, s.length - 2);
        }
        return s;
    };
    return Constant;
}());
var Binary = /** @class */ (function () {
    function Binary(l, tok, r) {
        this.left = l;
        this.operator = tok;
        this.right = r;
        this.name = 'Binary';
        this.map = {};
        this.map['left'] = this.left.toString();
        this.map['operator'] = this.operator.toString();
        this.map['right'] = this.right.toString();
    }
    /** Returns float value of this Expression */
    Binary.prototype.fValue = function () {
        if (this.operator == Token.PLUS)
            return this.left.fValue() + this.right.fValue();
        if (this.operator == Token.MINUS)
            return this.left.fValue() - this.right.fValue();
        if (this.operator == Token.STAR)
            return this.left.fValue() * this.right.fValue();
        if (this.operator == Token.SLASH)
            return this.left.fValue() / this.right.fValue();
        return NaN;
    };
    /** String representation of this Expression */
    Binary.prototype.toString = function () {
        return this.toString2(this.left, false) + this.operator + this.toString2(this.right, true);
    };
    Binary.prototype.toString2 = function (exp, atRight) {
        var s = exp.toString();
        if (!(exp instanceof Binary))
            return s;
        var prec = this.precedence();
        var p = exp.precedence();
        if (prec < p || (prec == p && !atRight))
            return s;
        return Token.LEFT + s + Token.RIGHT;
    };
    /** Converts this Expression to postfix (RPN) */
    Binary.prototype.toPostfix = function () {
        return this.left.toPostfix() + this.right.toPostfix() + ' ' + this.operator;
    };
    Binary.prototype.precedence = function () {
        if (this.operator == Token.PLUS || this.operator == Token.MINUS)
            return 10;
        if (this.operator == Token.STAR || this.operator == Token.SLASH)
            return 20;
        throw new Error("operation " + this.operator);
    };
    return Binary;
}());
/** Parser could be RecursiveDescentParser module, this is more clear. */
var Parser = /** @class */ (function () {
    function Parser(input) {
        this.lex = new Scanner(input);
        this.tok = Token.EMPTY;
    }
    Parser.prototype.match = function (matchToken) {
        if (this.tok == matchToken) {
            this.tok = this.lex.nextToken();
        }
        else
            this.expected(matchToken.toString());
    };
    Parser.prototype.expected = function (s) {
        throw new Error('Expected: ' + s + ', Found: ' + this.tok.toString());
    };
    Parser.prototype.takePoint = function () {
        if (this.model != undefined) {
            var point = this.model.takePoint();
            if (point != undefined)
                return point;
        }
        return new Point(0, 0);
    };
    Parser.prototype.checkPoint = function (point, status, name, region, props) {
        var shape = new RecursiveFunc(point, name, props);
        var tokenIndex;
        switch (this.tok) {
            case Token.NUMBER:
                tokenIndex = Math.floor((this.lex.prev + this.lex.next) / 2);
                break;
            case Token.EOF:
                tokenIndex = this.lex.next;
                break;
            default:
                tokenIndex = this.lex.prev;
                break;
        }
        var state = new State(status, this.tok, tokenIndex, region, shape);
        if (this.model != undefined)
            this.model.addState(state);
    };
    /** lazy referencing */
    Parser.prototype.attachModel = function (model) {
        this.model = model;
    };
    Parser.prototype.parse = function () {
        this.tok = this.lex.nextToken();
        //#state 
        var region = '';
        var point = this.takePoint();
        this.checkPoint(point, StateStatus.DRAW, 'Expression', region);
        var e = this.expr();
        //#state 
        if (e != undefined)
            this.checkPoint(point, StateStatus.DRAW, 'Expression', region, e.map);
        this.match(Token.EOF);
        return e;
    };
    Parser.prototype.expr = function () {
        var region = 'expression';
        var point = this.takePoint();
        this.checkPoint(point, StateStatus.DRAW, 'exp()', region);
        var e = this.term();
        //#region
        if (e != undefined)
            this.checkPoint(point, StateStatus.DRAW, e.name, region, e.map);
        var t = this.tok;
        while (t == Token.PLUS || t == Token.MINUS) {
            this.match(t);
            //#region 
            if (e != undefined) {
                var map = {};
                map['left'] = '' + e.toString();
                map['operator'] = t;
                map['right'] = '';
                region = 'PLUSMINUS';
                this.checkPoint(point, StateStatus.DRAW, 'Binary', region, map);
            }
            var term = this.term();
            if (term == undefined || e == undefined)
                return;
            e = new Binary(e, t, term);
            //#region
            if (e != undefined)
                this.checkPoint(point, StateStatus.DRAW, e.name, region, e.map);
            t = this.tok;
        }
        //#region 
        region = 'EXPRETURN';
        if (e != undefined)
            this.checkPoint(point, StateStatus.ERASE, e.name, region);
        return e;
    };
    Parser.prototype.term = function () {
        var region = 'TERM';
        var point = this.takePoint();
        this.checkPoint(point, StateStatus.DRAW, 'term()', region);
        var e = this.factor();
        //#state 
        if (e != undefined)
            this.checkPoint(point, StateStatus.DRAW, e.name, region, e.map);
        var t = this.tok;
        while (t == Token.STAR || t == Token.SLASH) {
            this.match(t);
            /** 2 lines below is typescript things.. */
            //#region 
            if (e != undefined) {
                var map = {};
                map['left'] = '' + e.toString();
                map['operator'] = t;
                map['right'] = '';
                region = 'STARSLASH';
                this.checkPoint(point, StateStatus.DRAW, 'Binary', region, map);
            }
            var factor = this.factor();
            if (factor == undefined || e == undefined)
                return;
            e = new Binary(e, t, factor);
            //#region 
            if (e != undefined)
                this.checkPoint(point, StateStatus.DRAW, e.name, region, e.map);
            t = this.tok;
        }
        //#region 
        region = 'TERMRETURN';
        if (e != undefined)
            this.checkPoint(point, StateStatus.ERASE, e.name, region);
        return e;
    };
    Parser.prototype.factor = function () {
        var region = 'FACTOR';
        var point = this.takePoint();
        this.checkPoint(point, StateStatus.DRAW, 'factor()', region);
        region = 'CONSTANT';
        if (this.tok == Token.NUMBER) {
            var c = new Constant(this.lex.nval);
            //#state 
            this.checkPoint(point, StateStatus.DRAW, c.name, region, c.map);
            region = 'CONSTANTMATCH';
            this.checkPoint(point, StateStatus.DRAW, c.name, region, c.map);
            this.match(Token.NUMBER);
            region = 'CONSTANTRETURN';
            this.checkPoint(point, StateStatus.ERASE, c.name, region);
            return c;
        }
        region = 'LEFT';
        this.checkPoint(point, StateStatus.DRAW, 'factor()', region);
        if (this.tok == Token.LEFT) {
            region = 'LEFTMATCH';
            this.checkPoint(point, StateStatus.DRAW, 'factor()', region);
            this.match(Token.LEFT);
            region = 'FACTOREXP';
            this.checkPoint(point, StateStatus.DRAW, 'factor()', region);
            var e = this.expr();
            //#state 
            if (e != undefined) {
                this.checkPoint(point, StateStatus.DRAW, e.name, region, e.map);
                region = 'RIGHTMATCH';
                this.checkPoint(point, StateStatus.DRAW, e.name, region);
                this.match(Token.RIGHT);
                region = 'LEFTRETURN';
                this.checkPoint(point, StateStatus.ERASE, e.name, region);
            }
            return e;
        }
        this.expected("Factor");
    };
    return Parser;
}());
var Scanner = /** @class */ (function () {
    function Scanner(input) {
        this.source = input;
        this.prev = 0;
        this.next = 0;
        this.tok = Token.EMPTY;
        this.nval = 0;
        this.sval = '';
    }
    Scanner.prototype.getNumber = function () {
        while (this.next < this.source.length) {
            var c = this.source.charAt(this.next);
            if (c == '.' || Scanner.isDigit(c))
                this.next++;
            else
                break;
        }
        this.tok = Token.NUMBER;
        var s = this.source.substring(this.prev, this.next);
        this.nval = parseFloat(s);
    };
    Scanner.isDigit = function (character) {
        return character.length === 1 && /^\d+$/.test(character);
    };
    Scanner.prototype.getIdent = function () {
        while (this.next < this.source.length) {
            var c = this.source.charAt(this.next);
            if (Scanner.isLetter(c) || Scanner.isDigit(c))
                this.next++;
            else
                break;
        }
        this.sval = this.source.substring(this.prev, this.next);
        this.tok = Token.IDENT;
    };
    Scanner.isLetter = function (character) {
        return character.length === 1 && /[a-z]/i.test(character);
    };
    /** Returns next token after reading a sufficient number of chars */
    Scanner.prototype.nextToken = function () {
        this.nval = 0;
        this.sval = '';
        var c;
        do {
            if (this.next >= this.source.length)
                return (this.tok = Token.EOF);
            c = this.source.charAt(this.next++); //read next char
        } while (Scanner.isWhiteSpace(c));
        this.prev = this.next - 1;
        if (Scanner.isLetter(c))
            this.getIdent();
        else if (Scanner.isDigit(c))
            this.getNumber();
        else
            this.tok = TokenParser.valueOf(c); //tok = c;
        return this.tok;
    };
    Scanner.isWhiteSpace = function (character) {
        return character.length === 1 && /\s/.test(character);
    };
    /** String representation of the current token */
    Scanner.prototype.toString = function () {
        var s = this.tok.toString();
        if (this.tok == Token.NUMBER)
            return Constant.numToStr(this.nval);
        if (this.tok == Token.IDENT)
            return this.sval;
        return s;
    };
    return Scanner;
}());
var Token;
(function (Token) {
    Token["EMPTY"] = "";
    Token["LEFT"] = "(";
    Token["RIGHT"] = ")";
    Token["EQUAL"] = "=";
    Token["PERIOD"] = ".";
    Token["SEMCOL"] = ";";
    Token["PLUS"] = "+";
    Token["MINUS"] = "-";
    Token["STAR"] = "*";
    Token["SLASH"] = "/";
    Token["COMMA"] = ",";
    Token["IDENT"] = "ident";
    Token["NUMBER"] = "number";
    Token["EOF"] = "eof";
})(Token || (Token = {}));
var TokenParser = /** @class */ (function () {
    function TokenParser() {
    }
    TokenParser.valueOf = function (character) {
        if (character == '(')
            return Token.LEFT;
        if (character == ')')
            return Token.RIGHT;
        if (character == '=')
            return Token.EQUAL;
        if (character == '.')
            return Token.PERIOD;
        if (character == ';')
            return Token.SEMCOL;
        if (character == '+')
            return Token.PLUS;
        if (character == '-')
            return Token.MINUS;
        if (character == '*')
            return Token.STAR;
        if (character == '/')
            return Token.SLASH;
        if (character == ',')
            return Token.COMMA;
        if (character == 'ident')
            return Token.IDENT;
        if (character == 'number')
            return Token.NUMBER;
        return Token.EOF;
    };
    return TokenParser;
}());
var Stack = /** @class */ (function () {
    function Stack() {
        this.length = 0;
        this.arr = [];
    }
    Stack.prototype.push = function (value) {
        this.arr.push(value);
        this.length = this.arr.length;
    };
    Stack.prototype.pop = function () {
        this.length = this.arr.length;
        return this.arr.pop();
    };
    Stack.prototype.peek = function () {
        return this.arr[this.arr.length - 1];
    };
    Stack.prototype.isEmpty = function () {
        return this.arr.length == 0;
    };
    return Stack;
}());
var Queue = /** @class */ (function () {
    function Queue() {
        this.length = 0;
        this.arr = [];
    }
    Queue.prototype.push = function (value) {
        this.arr.push(value);
        this.length = this.arr.length;
    };
    Queue.prototype.pushPriority = function (value) {
        this.arr.splice(0, 0, value);
        this.length = this.arr.length;
    };
    /** pops and returns first element in array */
    Queue.prototype.pop = function () {
        if (this.isEmpty())
            return undefined;
        var element = this.arr[0];
        this.arr.splice(0, 1);
        this.length = this.arr.length;
        return element;
    };
    Queue.prototype.peek = function () {
        return this.arr[0];
    };
    Queue.prototype.isEmpty = function () {
        return this.arr.length == 0;
    };
    return Queue;
}());
var Point = /** @class */ (function () {
    function Point(x, y) {
        this.x = x;
        this.y = y;
    }
    return Point;
}());
var RecursiveFunc = /** @class */ (function () {
    function RecursiveFunc(point, name, props) {
        this.name = name;
        this.props = props;
        // burası visualizer tarafından belirlencek
        this.x = point.x;
        this.y = point.y;
    }
    RecursiveFunc.prototype.getPoint = function () {
        return new Point(this.x, this.y);
    };
    return RecursiveFunc;
}());
var Highlighter = /** @class */ (function () {
    function Highlighter(code) {
        this._code = code;
        this.code = code;
        this.regions = {};
        this.stack = new Stack();
        var beginning = -1;
        var finale = -1;
        var region;
        for (var index = 0; index < code.length; index++) {
            var element = code[index];
            if (element == '#') {
                if (beginning == -1) {
                    if (code.substring(index + 1, index + 4) == 'END') {
                        while (code[++index] != '#') { }
                        index++;
                        continue;
                    }
                    beginning = index;
                }
                else {
                    finale = index;
                    region = code.substring(beginning + 1, finale);
                    this.regions[region] = region;
                    beginning = -1;
                    finale = -1;
                }
            }
        }
    }
    Highlighter.prototype.realCode = function () {
        return this.code;
    };
    Highlighter.prototype.adjustCode = function () {
        //let regexp = /#.*#/gi;
        //this.code = this._code.replace(regexp, '');
        this.code = this._code;
        for (var key in this.regions) {
            var span = "<span id='" + key.toLowerCase() + "'>";
            var spann = "</span>";
            this.code = this.code.replace('#' + key + '#\n', span);
            this.code = this.code.replace('#END' + key + '#\n', spann);
        }
    };
    return Highlighter;
}());
var Region = /** @class */ (function () {
    function Region(tag, beginning, finale) {
        this.tag = tag;
        this.beginning = beginning;
        this.finale = finale;
    }
    return Region;
}());
var RDPController = /** @class */ (function () {
    function RDPController(model, view) {
        this.stateIndexer = -1;
        this.model = model;
        this.view = view;
        this.model.attach(this);
    }
    RDPController.prototype.reinit = function (parserInput) {
        this.view.reinit();
        this.model.parse(parserInput);
        this.view.resize();
        this.view.updateExpression(parserInput);
        this.view.updateToken(Token.EMPTY, -1);
        this.stateIndexer = -1;
    };
    RDPController.prototype.takePoint = function () {
        return this.view.takePoint();
    };
    RDPController.prototype.releasePoint = function (point) {
        this.view.releasePoint(point);
    };
    RDPController.prototype.next = function () {
        if (this.stateIndexer < this.model.states.length - 1) {
            this.stateIndexer++;
            var state = this.model.states[this.stateIndexer];
            switch (state.status) {
                case StateStatus.DRAW:
                    if (state.shape != undefined) {
                        this.view.drawShape(state.shape);
                    }
                    break;
                case StateStatus.ERASE:
                    if (state.shape != undefined) {
                        this.view.eraseShape(state.shape);
                    }
                    break;
            }
            this.view.highlight(state.region);
            this.view.updateToken(state.token, state.tokenMoved);
        }
    };
    RDPController.prototype.prev = function () {
        /** TODO */
    };
    return RDPController;
}());
var RDPModel = /** @class */ (function () {
    function RDPModel() {
        this.states = [];
        this.expression = '';
    }
    RDPModel.prototype.parse = function (input) {
        this.states = [];
        this.expression = input;
        this.parser = new Parser(input);
        this.parser.attachModel(this);
        this.parser.parse();
    };
    RDPModel.prototype.attach = function (controller) {
        this.controller = controller;
    };
    RDPModel.prototype.addState = function (state) {
        this.states.push(state);
        if (state.status == StateStatus.ERASE && state.shape != undefined
            && this.controller != undefined) {
            this.controller.releasePoint(state.shape.getPoint());
        }
    };
    RDPModel.prototype.takePoint = function () {
        if (this.controller != undefined)
            return this.controller.takePoint();
    };
    return RDPModel;
}());
var shapeWidth = 150;
var shapeHeight = 150;
var RDPView = /** @class */ (function () {
    function RDPView() {
        this.WIDTH_CANVAS = 0;
        this.HEIGHT_CANVAS = 0;
        var canvasDiv = document.getElementById('canvas-area');
        this.canvas = document.createElement('canvas');
        /** takePoint() needs to know canvas div's width to give points when
         * modal needs it.
         */
        this.canvas.width = canvasDiv.clientWidth;
        this.points = new Queue();
        this.lastGivenPoint = new Point(0, 0);
        this.points.push(this.lastGivenPoint);
        this.highlighter = new Highlighter(_code);
        this.highlighter.adjustCode();
        this.updateCode(this.highlighter.code);
    }
    RDPView.prototype.resize = function () {
        var canvasDiv = document.getElementById('canvas-area');
        var points = this.points.arr;
        var canvasDimensions = new Point(0, 0);
        for (var index = 0; index < points.length; index++) {
            var element = points[index];
            //if(element.x > canvasDimensions.x) canvasDimensions.x = element.x;
            if (element.y > canvasDimensions.y)
                canvasDimensions.y = element.y;
        }
        this.canvas = document.createElement('canvas');
        //this.canvas.width=canvasDimensions.x + shapeWidth;
        this.canvas.width = canvasDiv.clientWidth;
        this.canvas.height = canvasDimensions.y + shapeHeight;
        while (canvasDiv.hasChildNodes) {
            var child = canvasDiv.lastChild;
            if (child == null)
                break;
            canvasDiv.removeChild(child);
        }
        canvasDiv.appendChild(this.canvas);
    };
    RDPView.prototype.reinit = function () {
        this.points = new Queue();
        this.lastGivenPoint = new Point(0, 0);
        this.points.push(this.lastGivenPoint);
        this.highlighter = new Highlighter(_code);
        this.highlighter.adjustCode();
        this.updateCode(this.highlighter.code);
    };
    RDPView.prototype.highlight = function (area) {
        //<span style='color:blue'> </span>
        this.unhighlight();
        if (area == '')
            return;
        var span = document.getElementById(area.toLowerCase());
        if (span != undefined) {
            span.style.color = 'red';
            var fontSize = window.getComputedStyle(span, null).getPropertyValue('font-size');
            span.style.fontSize = parseInt(fontSize) * 1.2 + 'px';
            this.highlighter.stack.push(area);
        }
    };
    RDPView.prototype.unhighlight = function () {
        var region = this.highlighter.stack.peek();
        if (region != undefined) {
            var prevSpan = document.getElementById(region.toLowerCase());
            prevSpan.removeAttribute("style");
        }
    };
    RDPView.prototype.getContext = function () {
        return this.canvas.getContext('2d');
    };
    RDPView.prototype.takePoint = function () {
        var point = this.points.pop();
        if (point == undefined) {
            var x = this.lastGivenPoint.x + shapeWidth;
            var y = this.lastGivenPoint.y;
            if (x + shapeWidth > this.canvas.width) {
                x = 0;
                y = y + shapeHeight;
            }
            point = new Point(x, y);
        }
        this.lastGivenPoint = point;
        return point;
    };
    RDPView.prototype.releasePoint = function (point) {
        this.points.pushPriority(point);
    };
    RDPView.prototype.drawShape = function (shape) {
        var counter = 0;
        var largestMeasureKey = 0;
        var largestMeasureValue = 0;
        if (shape.props != undefined) {
            for (var key in shape.props) {
                if (key.length > largestMeasureKey) {
                    largestMeasureKey = key.length;
                }
                var value = shape.props[key];
                if (value.length > largestMeasureValue) {
                    largestMeasureValue = value.length;
                }
                counter++;
            }
            /** While using font as 15px Arial, each characters size is almost 7
             * pixel. Thats why multiplying 7 and text.length
             */
            largestMeasureKey *= 7;
            largestMeasureValue *= 7;
            var width = largestMeasureValue + 25;
            var height = 90;
            /** all drawings should be placed below in these lines */
            var rectX = shape.x + largestMeasureKey + 10;
            var rectY = shape.y + 25;
            var rectW = width;
            var rectH = height;
            var ctx = this.getContext();
            this.eraseShape(shape);
            ctx.beginPath();
            ctx.font = "15px Arial";
            ctx.textBaseline = 'top';
            ctx.strokeText(shape.name, rectX, shape.y);
            ctx.strokeRect(rectX, rectY, rectW, rectH);
            var ara = height / counter; // 30
            var row = rectY + ara / 2;
            var seperatorX = rectX;
            var seperatorY = rectY + 1;
            ctx.textBaseline = 'middle';
            for (var key in shape.props) {
                var value = shape.props[key];
                ctx.moveTo(seperatorX, seperatorY);
                ctx.lineTo(seperatorX + rectW, seperatorY);
                ctx.stroke();
                ctx.strokeText(key, shape.x, row);
                ctx.fillText(value, rectX + 10, row);
                seperatorY += ara;
                row += ara;
            }
            ctx.closePath();
        }
        else {
            var ctx = this.getContext();
            this.eraseShape(shape);
            ctx.font = "15px Arial";
            ctx.textBaseline = 'top';
            ctx.strokeText(shape.name, shape.x, shape.y);
            ctx.strokeRect(shape.x, shape.y + 25, 100, 100);
        }
    };
    RDPView.prototype.eraseShape = function (shape) {
        var ctx = this.getContext();
        ctx.clearRect(shape.x - 5, shape.y - 5, this.canvas.width - shape.x + 5, this.canvas.height - shape.y + 5);
    };
    RDPView.prototype.updateExpression = function (expression) {
        var expr = document.getElementById('tok-expression');
        expr.innerHTML = ' ' + expression;
    };
    RDPView.prototype.updateToken = function (tok, tokIndex) {
        var pointer = document.getElementById('pointer');
        var blank = '';
        for (var index = -1; index < tokIndex; index++) {
            blank += ' ';
        }
        blank += "^ TOKEN = " + tok.toString();
        pointer.innerHTML = blank;
    };
    RDPView.prototype.updateCode = function (code) {
        var codeArea = document.getElementById('code');
        codeArea.innerHTML = code;
    };
    return RDPView;
}());
var _code = "<h3>Code</h3>\n<pre style=\"display: inline-block\">\nExpression expr() {\n#EXPRESSION#\n&emsp;&emsp;Expression e = term();\n#ENDEXPRESSION#\n&emsp;&emsp;Token t = tok;\n#PLUSMINUS#\n&emsp;&emsp;while (t == Token.PLUS || t == Token.MINUS)  {\n&emsp;&emsp;&emsp;&emsp;match(t);\n&emsp;&emsp;&emsp;&emsp;e = new Binary(e, t, term());\n&emsp;&emsp;&emsp;&emsp;t = tok;\n&emsp;&emsp;}\n#ENDPLUSMINUS#\n#EXPRETURN#\n&emsp;&emsp;return e;\n#ENDEXPRETURN#\n}\nExpression term() {\n#TERM#\n&emsp;&emsp;Expression e = factor();\n#ENDTERM#\n&emsp;&emsp;Token t = tok;\n#STARSLASH#\n&emsp;&emsp;while (t == Token.STAR || t == Token.SLASH)  {\n&emsp;&emsp;&emsp;&emsp;match(t);\n&emsp;&emsp;&emsp;&emsp;e = new Binary(e, t, factor());\n&emsp;&emsp;&emsp;&emsp;t = tok;\n&emsp;&emsp;}\n#ENDSTARSLASH#\n#TERMRETURN#\n&emsp;&emsp;return e;\n#ENDTERMRETURN#\n}\nExpression factor() {\n#FACTOR#\n&emsp;&emsp;if (tok == Token.NUMBER)  {\n#CONSTANT#\n&emsp;&emsp;&emsp;&emsp;Expression c = new Constant(lex.nval);\n#ENDCONSTANT#\n#CONSTANTMATCH#\n&emsp;&emsp;&emsp;&emsp;match(Token.NUMBER);\n#ENDCONSTANTMATCH#\n#CONSTANTRETURN#\n&emsp;&emsp;&emsp;&emsp;return c;\n#ENDCONSTANTRETURN#\n&emsp;&emsp;}\n&emsp;&emsp;if (tok == Token.LEFT)  {\n#LEFT#\n#LEFTMATCH#\n&emsp;&emsp;&emsp;&emsp;match(Token.LEFT);\n#ENDLEFTMATCH#\n#FACTOREXP#\n&emsp;&emsp;&emsp;&emsp;Expression e = expr();\n#ENDFACTOREXP#\n#RIGHTMATCH#\n&emsp;&emsp;&emsp;&emsp;match(Token.RIGHT);\n#ENDRIGHTMATCH#\n#ENDLEFT#\n#LEFTRETURN#\n&emsp;&emsp;&emsp;&emsp;return e;\n#ENDLEFTRETURN#\n&emsp;&emsp;}\n#ENDFACTOR#\n&emsp;&emsp;expected(\"Factor\");\n&emsp;&emsp;return null;\n}\n</pre>";
var State = /** @class */ (function () {
    function State(status, tok, tokenMoved, region, shape) {
        this.status = status;
        this.token = tok;
        this.tokenMoved = tokenMoved;
        this.shape = shape;
        this.region = region;
    }
    State.prototype.toString = function () {
        var str = '';
        if (this.shape != undefined)
            str = this.shape.name + '-';
        return str + ' Status: ' + this.status + " Token: " + this.token;
    };
    return State;
}());
var StateStatus;
(function (StateStatus) {
    StateStatus[StateStatus["DRAW"] = 0] = "DRAW";
    StateStatus[StateStatus["ERASE"] = 1] = "ERASE";
    StateStatus[StateStatus["TOKEN"] = 2] = "TOKEN";
})(StateStatus || (StateStatus = {}));
var view = new RDPView();
var model = new RDPModel();
var controller = new RDPController(model, view);
document.getElementById("input-exp").value = '44 + 33';
function start() {
    try {
        var input = document.getElementById("input-exp");
        controller.reinit(input.value);
        document.getElementById('visual').style.visibility = 'visible';
        document.getElementById('next').style.visibility = 'visible';
        document.location.href = '#form';
    }
    catch (e) {
        document.getElementById('visual').style.visibility = 'hidden';
        document.getElementById('next').style.visibility = 'hidden';
        var alertMessage = 'Please, enter a valid expression!';
        var errorMessage = e.message;
        if (errorMessage.indexOf('Expected') != -1)
            alertMessage += '\n' + errorMessage;
        alert(alertMessage);
    }
}
function next() {
    controller.next();
}
document.addEventListener('keyup', function (e) {
    //console.log(e.key + '-' + e.keyCode);
    if (e.key == 'ArrowRight') {
        next();
    }
    else if (e.key == 'ArrowLeft') {
        //visualizer.prev();
    }
    else if (e.key == 'Enter') {
        //start();
    }
});
document.getElementById('start').onclick = function () {
    start();
};
document.getElementById('next').onclick = function () {
    next();
};
