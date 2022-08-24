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

const Reg = {
	first_letter: /^[_a-zA-Z]$/, //首字母正则
	letter: /^[_a-zA-Z0-9]+$/, //字母正则
	keyword: /^(const|let|var)$/, //关键字正则
};

/**
 * 词法分析器
 * @param {string} input
 */
function tokenizer(input) {
	let flag = 0; //当前的位置游标
	let tokenList = []; //词法 token 数组

	while (flag < input.length) {
		let token = [input[flag]];

		//关键字和变量匹配
		//匹配首字母，如果是字符串，则有可能是关键字或者定义的变量
		if (Reg.first_letter.test(token[0])) {
			console.log(flag, "===");
			flag++;
			token.push(input[flag]);
			while (Reg.letter.test(token.join(""))) {
				flag++;
				token.push(input[flag]);
			}
			//上面未匹配到字母需要把 token 最后一位退出
			token.pop();
			if (Reg.keyword.test(token.join(""))) {
				tokenList.push({ type: "T_Key", value: token.join("") });
			} else {
				tokenList.push({ type: "T_Var", value: token.join("") });
			}
			continue;
		}
		flag++;
	}

	return tokenList;
}

const input = "const a = 1 + 2;";
console.log(tokenizer(input));
