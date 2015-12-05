
const HEIGHT = 400
const WIDTH = 650

const getPosStyle = (gen, num) => {
  const r = 200 / 9 * gen * Math.pow(1.1, gen)
  const theta = arc / (Math.pow(2, gen)) * (num + .5) - arc / 2
  return {
    top: HEIGHT * .8 - Math.cos(theta) * r,
    left: WIDTH/2 + Math.sin(theta) * r,
  }
}

const arc = Math.PI * 1.5

const posStyles = {}
for (let gen=0; gen<8; gen++) {
  const maxNum = Math.pow(2, gen)
  for (let num=0; num<maxNum; num++) {
    posStyles['' + gen + ':' + num] = getPosStyle(gen, num)
  }
}

export default posStyles
