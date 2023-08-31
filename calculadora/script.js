Clear()

function WriteOp(char) {
   
   // if (!IsValid()) {

   //    alert(`[ERRO] ${char} não é um valor válido`)

   // } else 
   if (EndOp()) {

      alert(`[ERRO] operador inválido na sentença atual...`)

   } else {

      painel.innerText += char
      
   }
}

function WriteNum(char) {
   painel.innerText += char
}

function Clear() {
   painel.innerText = ' '
}

function Equals() {
   let exp = painel.value
}


function EndOp() {
   let str =  painel.textContent
   let pos = str.length-1

   str = str.replaceAll('+', '.')
   str = str.replaceAll('-', '.')
   str = str.replaceAll('x', '.')
   str = str.replaceAll('/', '.')

   if (str[pos] == '.') {
      return true
   } else {
      return false
   }

}