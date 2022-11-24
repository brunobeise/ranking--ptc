
let lista = []
let players = []
let textos = []
let admin

var data = new Date();
var dia = String(data.getDate()).padStart(2, '0');
var mes = String(data.getMonth() + 1).padStart(2, '0');
var ano = data.getFullYear();
dataAtual = dia + '/' + mes + '/' + ano;

document.addEventListener('DOMContentLoaded', async () => {
admin = JSON.parse(localStorage.getItem('adm') || '[]')
if(admin != ''){
  document.getElementById('addjogo').classList.remove('d-none')
    document.getElementById('titulo').innerText="Adicionar Jogo"
}
lista = await fetch(`https://rankingptc.herokuapp.com/getRows`)
    .then(res => res.json())
    .then(res => {
        let dados = res.values
        
        return dados.map((obj) => {
            return obj 
        })

    })
    textos = await fetch(`https://rankingptc.herokuapp.com/getTextos`)
    .then(res => res.json())
    .then(res => {
        let dados = res.values
        
        return dados.map((obj) => {
            return obj 
        })

    })
    mostrarlista() 
    carregarselects()
    carregarselectsdesafio()
})
function mostrarlista(){

  const tbody = document.getElementById('tbody')
  tbody.innerHTML=""
    players = []
    console.log(lista);
    lista.forEach((obj, i) => {
        const newplayer = {
            nome: obj[0],
            rating: Number((obj[1]).toFixed(2)),
            jogos: obj[2],
            disp: obj[3]
        }
        
        players.push(newplayer)

        
    })
    players = players.sort((a,b) => {
      return b.rating - a.rating
    })

    console.log(players);

    players.forEach((obj, i) => {
     
     const tr = document.createElement('tr')
     const th = document.createElement('th')
     th.setAttribute('scope', 'row')
     const tdnome = document.createElement('td')
     const tdrating = document.createElement('td')
     const tdjogos = document.createElement('td')
     const tddisp = document.createElement('td')
      
      if(obj.disp == "disp"){
        tddisp.innerHTML='✔'
      }else{
        tddisp.innerHTML='❌'
      }

      
     tdnome.innerHTML=`${obj.nome}`
     tdrating.innerHTML=`${obj.rating}`
     tdjogos.innerHTML=`${obj.jogos}`
     th.innerText=`${i+1}º`
     tr.appendChild(th)
     tr.appendChild(tdnome)
     tr.appendChild(tdrating)
     tr.appendChild(tdjogos)
     tr.appendChild(tddisp)
     tbody.appendChild(tr)
    })

    textos.reverse()
    textos.forEach(obj => {
      const p = document.createElement('p')
      p.innerHTML=obj
      document.querySelector('#containertexto').appendChild(p)
    })
    
    
}



function salvartabela(array){
    let values = []
    players.forEach((obj, i) => {
        const newvalue = [
                obj.nome,
                Number(obj.rating),
                Number(obj.jogos),
                obj.disp
        ]        
        values.push(newvalue)
    })
    const data = { values };

fetch(`https://rankingptc.herokuapp.com/updateValue`, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify(data),
})
  .then((response) => response.json())
  .then((data) => {
    console.log("Success:", data);
    alert('Feito com Sucesso.')
    location.reload()
  })
  .catch((error) => {
    console.error("Error:", error);
  });
}

function adm(){
  if (document.getElementById('formadmlogin').value == 'adm' && document.getElementById('formadmsenha').value == 'adm' ){
    document.getElementById('addjogo').classList.remove('d-none')

    document.getElementById('titulo').innerText="Adicionar Jogo"
    localStorage.setItem('adm', JSON.stringify('admON'))
  }else{alert('Dados Incorretos.')}

}

function carregarselects(){
  const select1 = document.getElementById('select1')
  const select2 = document.getElementById('select2')
  select1.innerHTML='<option selected disabled value="">Seleione o Jogador</option>'
  select2.innerHTML='<option selected disabled value="">Seleione o Jogador</option>'
  players.forEach(obj => {
  
    const option = document.createElement('option')
    option.setAttribute('value', `${obj.nome}`)
    option.innerHTML=obj.nome
    select1.appendChild(option)
  })
  players.forEach(obj => {
  
    const option = document.createElement('option')
    option.setAttribute('value', `${obj.nome}`)
    option.innerHTML=obj.nome
    select2.appendChild(option)
  })
}

function carregarselectsdesafio(){
  const select1 = document.getElementById('selectDesafiador')
  const select2 = document.getElementById('selectDesafiado')
  select1.innerHTML='<option selected disabled value="">Seleione o Jogador</option>'
  select2.innerHTML='<option selected disabled value="">Seleione o Jogador</option>'
  players.forEach(obj => {
  
    const option = document.createElement('option')
    option.setAttribute('value', `${obj.nome}`)
    option.innerHTML=obj.nome
    select1.appendChild(option)
  })

  const disponiveis = players.filter(obj => 
    obj.disp == 'disp'
  )

  disponiveis.forEach(obj => {
  
    const option = document.createElement('option')
    option.setAttribute('value', `${obj.nome}`)
    option.innerHTML=obj.nome
    select2.appendChild(option)
  })
}

function infosganhador(){

  const p1 = document.querySelector('#rateinfo1')
  const p2 = document.querySelector('#rateinfo2')
  const selectvalue1 = document.querySelector('#select1').value
  const selectvalue2 = document.querySelector('#select2').value
  const obj1 = players.find((obj) => 
    obj.nome == selectvalue1
  )
  const obj2 = players.find((obj) => 
    obj.nome == selectvalue2
  )

  if(selectvalue1 && selectvalue2){
  const ratingganhador = calcRatingGanhador(obj2.rating, obj1.rating)
  const ratingperdedor = calcRatingPerdedor(obj2.rating, obj1.rating)
  console.log(`rating ganhador: ${ratingganhador}`);
  console.log(`rating perdedor: ${ratingperdedor}`);
  p1.innerHTML=`${obj1.rating}  🠮 <spam style='color: green'> ${(obj1.rating + ratingganhador).toFixed(2)} </spam>`
  p2.innerHTML=`${obj2.rating}  🠮 <spam style='color: red'> ${(obj2.rating - ratingganhador).toFixed(2)} </spam>`
  }

  
}

function infosdesafio(){
  

  const p1 = document.querySelector('#rateinfoDesafiador')
  const p2 = document.querySelector('#rateinfoDesafiado')
  const selectvalue1 = document.querySelector('#selectDesafiador').value
  const selectvalue2 = document.querySelector('#selectDesafiado').value
  const obj1 = players.find((obj) => 
    obj.nome == selectvalue1
  )
  const obj2 = players.find((obj) => 
    obj.nome == selectvalue2
  )

  if(selectvalue1 && selectvalue2){
  const ratingganhador = calcRatingGanhador(obj2.rating, obj1.rating)
  const ratingperdedor = calcRatingPerdedor(obj2.rating, obj1.rating)
  console.log(ratingganhador, ratingperdedor);
  p1.innerHTML=`<p>(${obj1.rating.toFixed(2)})</p>
  <p style="color: red;"><i class="bi bi-arrow-down-square-fill"></i> ${(obj1.rating - ratingperdedor).toFixed(2)}</p>
  <p style="color: green;"><i class="bi bi-arrow-up-square-fill"></i> ${(obj1.rating + ratingganhador).toFixed(2)}</p>
  `

  p2.innerHTML=`<p>(${obj2.rating.toFixed(2)})</p>
  <p style="color: green;"><i class="bi bi-arrow-up-square-fill"></i> ${(obj2.rating + ratingperdedor).toFixed(2)}</p>
  <p style="color: red;"><i class="bi bi-arrow-down-square-fill"></i> ${(obj2.rating - ratingganhador).toFixed(2)}</p>
  
  `

  }

  
}

function desafio(){
  const desafiador = document.querySelector('#selectDesafiador').value
  const desafiado = document.querySelector('#selectDesafiado').value

  const idesafiador = players.findIndex((obj) => 
    obj.nome == desafiador
  )
  const idesafiado = players.findIndex((obj) => 
    obj.nome == desafiado
  )

  if(desafiado && desafiador && desafiador != desafiado){
    players[idesafiado].disp = 'no'
  salvartabela(players)
  }
  else{
    alert('Não foi possível fazer o desafio.')
  }
  
}

function calcRatingPerdedor(RA , RB){
  const x = Math.pow(10, (RB - RA)/400)
  const rating  = Number((1/1+x).toFixed(2))*5
  return rating
}

function calcRatingGanhador(RA , RB){
  const x = Math.pow(10, (RA - RB)/400)
  const rating  = Number((1/1+x).toFixed(2))*5
  return rating
}

function adicionarjogo(){
  const selectvalue1 = document.querySelector('#select1').value
  const selectvalue2 = document.querySelector('#select2').value
  let index1, index2
  if(selectvalue1 && selectvalue2){
    if(selectvalue1 != selectvalue2){
      const obj1 = players.find((obj, i) => {
        index1 = i
        return obj.nome == selectvalue1
      }
    )
      const obj2 = players.find((obj, i) => {
        index2 = i
        return obj.nome == selectvalue2
      }
    )

    const ratingganhador = calcRatingGanhador(obj2.rating, obj1.rating)
    const ratingperdedor = calcRatingPerdedor(obj2.rating, obj1.rating)

    const texto = [`${dataAtual}: ${players[index1].nome}(${players[index1].rating}) ganhou de ${players[index2].nome}(${players[index2].rating})`]

    players[index1].rating += ratingganhador
    players[index2].rating -= ratingganhador
    players[index1].jogos += 1
    players[index2].jogos += 1

   
    let values = []
    values.push(texto)
    const data = { values }
      console.log(values);
    fetch(`https://rankingptc.herokuapp.com/addRow`, {
      
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify(data),
})
  .then((response) => response.json())
  .then((data) => {
    console.log("Success:", data);
  })
  .catch((error) => {
    console.error("Error:", error);
  });

   salvartabela(players)

    }else{
      alert('Não é possível selecionar o mesmo jogador.')
    }
  }else{
    alert('Jogadores não selecionados.')
  }
}


 

