Clear() // limpeza inicial


/* Ação dos botões +, -, x e / (operadores), escreve o operador na tela */
function WriteOp(op) {
    painel.innerText += op
}

/* Ação dos botões 0 a 9 (números), escreve o número na tela */
function WriteNum(num) {
    painel.innerText += num
}

/* Ação do botão clear (C), limpa a tela */
function Clear() {
    painel.innerText = ''
}

/* Ação do botão de igualdade (=) */
function Equals() {
    /* Captura a expressão da tela */
    let exp = painel.textContent.trim()

    
    if (!CharsValid(exp)) { /* Erro de caractere */
        alert('Há algum erro na expressão, corrija para obter o resultado...')
    } else if (!OpValid(exp)) { /* Erro de operador */
        alert('Há algum erro nos operadores, corrija para obter o resultado...')
    } else if (DivByZero(exp)) { /* Erro de divisão por zero */
        alert('Você não pode dividir por zero...')
    } else { /* Execução pretendida, caso não haja erro */
        
        let result = Calc(exp)

        painel.innerText = result
    }
}

/* Validação dos operadores, retorna true se válido */
function OpValid(exp) {

    /* Troca dos caracteres por "coringas", reduz de 24 para 4 combinações */
    exp = exp.replaceAll('x', '.')
    exp = exp.replaceAll('/', '.')
    exp = exp.replaceAll('+', '#')
    exp = exp.replaceAll('-', '#')

    /* Análize das combinações (com os caracteres substituidos para encurtar) */
    if (exp.includes('..') || exp.includes('#.') || exp.includes('##') || exp.startsWith('.') || exp.endsWith('.') || exp.endsWith('#')) {
        
        return false /* Caso exista um operador inadequado, validade negada */

    } else {

        return true /* Caso não exista, validade confirmada */
    }

}
/* Validação dos caracteres, retorna true se válido */
function CharsValid(exp) {
    /* Caracteres aceitos */
    let chars = '0123456789'+'+-/x' 

    /* apaga todos os caracteres aceitos */
    for (let j = 0; j < chars.length; j++) {
        
        exp = exp.replaceAll(chars[j], '')
    }
    
    /* Se após remover os válido não restarem caracteres, retona true */
    if (exp.length == 0) {
        return true
    } else {
        return false
    }
}

/* Checagem de divisão por zero, retorna true se exixte */
function DivByZero(exp) {
    /* Tira os operadores + e - para evitar alguns casos, como: /+0 */
    exp = exp.replaceAll('+', '')
    exp = exp.replaceAll('-', '')

    /* Troca os números por #, menos os zeros */
    for (let i = 1; i < 10; i++) {
        
        exp = exp.replaceAll(`${i}`, '#')
        
    }

    /* Enquanto existir 0 seguido de # (número), remove o 0, isso evita erros em expressões como: /01 */
    while (exp.includes('0#')) {
        exp = exp.replaceAll('0#', '#')
    }

    /* Se ainda houver /0 na operação, retorna true */
    if (exp.includes('/0')) {
        return true
    } else { /* Caso tenha restado algum */
        return false
    }
}


function Calc(exp) {

    /* Formata a expressão */
    exp = StringFormater(exp)

    /* Transforma ela em um array */
    let result = ToArray(exp)

    result = precedence1(result)
    result = precedente0(result)

    return result 
}

/* Corrige algumas falhas nos operadores */
function StringFormater(exp) {
    /* Corrige os operadores aceitos juntos */
    exp = exp.replaceAll('-', '+-') // subtração se torna soma de valor negativo
    exp = exp.replaceAll('/+', '/')
    exp = exp.replaceAll('x+', 'x')

    /* Retira o + inicial, se houver */
    if (exp.startsWith('+')) {
        exp = exp.replace('+', '')
    }

    /* Retorna a expressão formatada */
    return exp
}

/* Transforma a string da expressão em array [string necessariamente tratada] */
function ToArray(exp) {
    let ops = '+x/'

    /* Separa cada valor e operador por ponto (.) */
    for (let i = 0; i < ops.length; i++) {
        
        exp = exp.replaceAll(ops[i], `.${ops[i]}.`)
        
    }

    /* Retorna um vetor, separando cada posição de acordo com a marcação de pontos (.) */
    return exp.split('.')
}

/* Retorna a expressão com multiplicação e divisão resolvidas */
/* Penultimo na ordem de precedência (x e /) */
function precedence1(arrayExp) {
    
    /* Se não houver multiplicação ou divisão, retorna a expressão sem alterações */
    if (!arrayExp.includes('/') && !arrayExp.includes('x')) {
        return arrayExp
    } else { /* Se houver multiplicação ou divisão, processa antes de retornar */

        /* percorre todas as posições da expressão */
        for (let i = 0; i < arrayExp.length; i++) {
            
            /* se houver uma barra na posição */
            if (arrayExp[i] == '/') {
                
                /* Salva o resulatado da divisão na posição do segundo valor */
                arrayExp[i+1] = arrayExp[i-1] / arrayExp[i+1]

                /* onde haviam o primeiro valor e o operador é atribuido '#' */
                arrayExp[i]   = '#'
                arrayExp[i-1] = '#'

                /* ... [i-1] [i] [i+1] ... */

            } else if (arrayExp[i] == 'x') {
                
                /* Salva o resulatado da multiplicação na posição do segundo valor */
                arrayExp[i+1] = arrayExp[i-1] * arrayExp[i+1]

                /* onde haviam o primeiro valor e o operador é atribuido '#' */
                arrayExp[i]   = '#'
                arrayExp[i-1] = '#'

                /* ... [i-1] [i] [i+1] ... */

            }
            
        }

        let result = []

        /* percorre todas as posições da expressão resultante */
        for (let i = 0; i < arrayExp.length; i++) {
            
            /* salvando todos os valores, e ignorando posições contendo "#" */
            if (arrayExp[i] != '#') {
                result.push(arrayExp[i])
            }
            
        }

        /* Retorna o array com multiplicações e divisões resolvidas */
        return result

    }

}

/* Retorna o resultado da expressão */
/* Ultimo na ordem de precedencia (+ e -) */
function precedente0(arrayExp) {
    let sum = 0

    /* Percorre a expressão, somando todos os valores e ignorando operadores */
    /* (não existe subtração, só soma de valor negativo) */
    for (let i = 0; i < arrayExp.length; i++) {
        
        if (arrayExp[i] != '+') {
            sum += Number(arrayExp[i])
        }
        
    }

    /* Finalmente... returna o resultado (T-T) */
    return sum

}