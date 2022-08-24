const TYPE_MAP = {
	"T_(": "(",
	"T_)": ")",
	T_Number: "[/d]",
	T_String: "[/w]",
	T_Var: "const let var function ...",
	T_Key: "const let var function ...",
	T_Operator: "+ - = < <= >=",
	T_End: ";",
};

/**
 * 词法分析器
 * @param { number } flag //当前的 token 位置
 * @param { String[] } token //当前的 token 首字母
 * @param { Any[] } tokenList  //最终 token 的集合
 * @param { String } input //原始字符串
 */
class Tokenizer {
	constructor(input) {
		this.input = input;
		this.flag = 0;
		this.tokenList = [];
		this.token = [];
		this.Reg = {
			first_letter: /^[_a-zA-Z]$/, //首字母正则
			letter: /^[_a-zA-Z0-9]+$/, //字母正则
			keyword: /^(const|let|var)$/, //关键字正则
			space: /^\s+$/, //空格校验正则
			string: /^('.*'|".*")$/s, //空格校验正则 /s dotAll ES2018
			number: /^[0-9]$/, //数字校验正则
			operator: /^[+|-|*|/|=]$/, //操作符，暂时先支持加减乘除和赋值
		};
	}

	//词法分析
	analysis() {
		while (this.flag < this.input.length) {
			// 取当前 flag 位的字符
			this.token = [this.input[this.flag]];
			switch (true) {
				//如果当前位是字符，则可能是关键字或者定义的变量
				case this.Reg.first_letter.test(this.token[0]):
					this.keywordMatch();
					break;
				//如果当前位是空格或者空格制表符之类的，直接跳过
				case this.Reg.space.test(this.token[0]):
					this.flag++;
					break;
				// 如果当前位是 " 或者 ',则为字符
				case ["'", '"'].includes(this.token[0]):
					this.stringMatch();
					break;
				// 如果当前位是数字,则为数字
				case this.Reg.number.test(this.token[0]):
					this.numberMatch();
					break;
				// 如果当前位是 +-*/=,则为运算符
				case ["+", "-", "*", "/", "="].includes(this.token[0]):
					this.tokenList.push({
						type: "T_Operator",
						value: this.token.join(""),
					});
					this.flag++;
					break;
				//如果当前位是结束符
				case this.token[0] === ";":
					this.tokenList.push({
						type: "T_End",
						value: this.token.join(""),
					});
					this.flag++;
					break;
				default:
					throw "The input char type does not match";
			}
		}
		return this.tokenList;
	}

	//关键字匹配
	keywordMatch() {
		this.flag++;
		this.token.push(this.input[this.flag]);
		while (this.Reg.letter.test(this.token.join(""))) {
			if (this.flag < this.input.length) {
				this.flag++;
				this.token.push(this.input[this.flag]);
			} else {
				break;
			}
		}
		//上面未匹配到字母需要把 token 最后一位退出
		this.token.pop();
		if (this.Reg.keyword.test(this.token.join(""))) {
			this.tokenList.push({ type: "T_Key", value: this.token.join("") });
		} else {
			this.tokenList.push({ type: "T_Var", value: this.token.join("") });
		}
	}

	//字符串匹配
	stringMatch() {
		this.flag++;
		this.token.push(this.input[this.flag]);
		//循环取出当前的 "" 或者 '' 包裹的字符串
		while (this.input[this.flag] !== this.token[0]) {
			if (this.flag < this.input.length) {
				this.flag++;
				this.token.push(this.input[this.flag]);
			} else {
				throw "illegal String";
			}
		}
		this.flag++;
		//去除前后的引号
		this.token.shift();
		this.token.pop();
		this.tokenList.push({ type: "T_String", value: this.token.join("") });
	}

	//数字匹配
	numberMatch() {
		this.flag++;
		this.token.push(this.input[this.flag]);
		while (!isNaN(this.token.join(""))) {
			if (this.flag < this.input.length) {
				this.flag++;
				this.token.push(this.input[this.flag]);
			} else {
				break;
			}
		}
		//上面未匹配到数字需要把 token 最后一位退出
		this.token.pop();
		this.tokenList.push({ type: "T_Number", value: this.token.join("") });
	}
}

const input = "const a = '2'; let b=1+2; let csss = a+b;";
console.log(new Tokenizer(input).analysis());
