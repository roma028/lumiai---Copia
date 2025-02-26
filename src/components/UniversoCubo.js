import { useRef, useEffect } from 'react';

const UniversoCubo = () => {
  const sketchRef = useRef();

  useEffect(() => {
    import('p5').then((p5) => {
      const sketch = (p) => {
        let particulas = [];
        let sliderEnergia, sliderEntropia;
        let angulo = 0;
        let inputEnergia, inputEntropia;

        p.setup = () => {
          p.createCanvas(1200, 610, p.WEBGL);
          let offsetY = 530;

          let labelEnergia = p.createP('Energia');
          labelEnergia.position(30, offsetY + 10);
          labelEnergia.style('color', '#fff');
          sliderEnergia = p.createSlider(0, 100, 50);
          sliderEnergia.position(30, offsetY);
          sliderEnergia.size(1000, 100);

          inputEnergia = p.createInput('50', 'number');
          inputEnergia.position(1070, offsetY + 40);
          inputEnergia.size(50, 20);
          inputEnergia.input(() => {
            let valor = parseInt(inputEnergia.value());
            if (!isNaN(valor) && valor >= 0 && valor <= 100) {
              sliderEnergia.value(valor);
            }
          });

          let labelEntropia = p.createP('Entropia');
          labelEntropia.position(30, offsetY + 60);
          labelEntropia.style('color', '#fff');
          sliderEntropia = p.createSlider(0, 100, 49);
          sliderEntropia.position(30, offsetY + 50);
          sliderEntropia.size(1000, 100);

          inputEntropia = p.createInput('49', 'number');
          inputEntropia.position(1070, offsetY + 90);
          inputEntropia.size(50, 20);
          inputEntropia.input(() => {
            let valor = parseInt(inputEntropia.value());
            if (!isNaN(valor) && valor >= 0 && valor <= 100) {
              sliderEntropia.value(valor);
            }
          });
        };

        p.draw = () => {
          p.background(0);
          p.orbitControl();
          p.rotateY(angulo);
          angulo += 0.005;

          let energia = sliderEnergia.value();
          let entropia = sliderEntropia.value();

          while (particulas.length < energia * 25) {
            particulas.push({
              x: p.random(-150, 150),
              y: p.random(-150, 150),
              z: p.random(-150, 150),
              vx: 0, vy: 0, vz: 0,
              tamanho: p.random(0, 1),
              cor: [p.random(255), p.random(255), p.random(255)]
            });
          }
          while (particulas.length > energia * 25) {
            particulas.pop();
          }

          for (let i = 0; i < particulas.length; i++) {
            let particula = particulas[i]; // Use 'particula' instead of 'p'
            if (entropia > 50) {
              particula.vx += p.random(-entropia / 50, entropia / 50);
              particula.vy += p.random(-entropia / 50, entropia / 50);
              particula.vz += p.random(-entropia / 50, entropia / 50);
            } else {
              for (let j = i + 1; j < particulas.length; j++) {
                let outra = particulas[j];
                let dx = outra.x - particula.x;
                let dy = outra.y - particula.y;
                let dz = outra.z - particula.z;
                let dist = p.sqrt(dx * dx + dy * dy + dz * dz);
                if (dist > 0 && dist < 50) {
                  let forca = (50 - entropia) / (dist * 10);
                  particula.vx += dx * forca;
                  particula.vy += dy * forca;
                  particula.vz += dz * forca;
                  outra.vx -= dx * forca;
                  outra.vy -= dy * forca;
                  outra.vz -= dz * forca;
                }
              }
            }

            particula.x += particula.vx;
            particula.y += particula.vy;
            particula.z += particula.vz;
            particula.x = p.constrain(particula.x, -150, 150);
            particula.y = p.constrain(particula.y, -150, 150);
            particula.z = p.constrain(particula.z, -150, 150);
            particula.vx *= 0.95;
            particula.vy *= 0.95;
            particula.vz *= 0.95;
          }

          p.stroke(255, 50);
          p.noFill();
          p.box(300);
          p.noStroke();
          for (let particula of particulas) { // Use 'particula' here too
            p.push();
            p.translate(particula.x, particula.y, particula.z);
            p.fill(particula.cor[0], particula.cor[1], particula.cor[2]);
            p.sphere(particula.tamanho);
            p.pop();
          }
        };
      };

      const myP5 = new p5.default(sketch, sketchRef.current);
      return () => myP5.remove(); // Limpa ao desmontar
    });
  }, []);
  

  return <div ref={sketchRef} style={{ display: 'inline-block' }} />;
};

export default UniversoCubo;