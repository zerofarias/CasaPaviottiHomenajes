$(document).ready(function () {

  var tiempoInhumados = 30000;
  var tiempoMsjs = 9000;
  var duracionSalas = 15000;

  /////////////////// RECIBE JSON de AJAX y LLAMA A FUNCION CAMBIO PANTALLA Y ESCRIBIR HTML////////////////////////
      function cargarDato(data,canServicios) {
        var inhumados = data;
        let num = 0;
        var cantidadServicios = canServicios;
  
        setInterval(() => {
          num = num + 1;
          if (num < cantidadServicios) {
              escribirHTML(inhumados, num);
              cambiarPantalla(inhumados,cantidadServicios)
          } else {
              num = 0;
              escribirHTML(inhumados, num);
              cambiarPantalla(inhumados,cantidadServicios)
          }
        }, tiempoInhumados);
        ///3Min Son 180000
  
        escribirHTML(inhumados, 0);
      }
  
    ////////////////// ESCRIBE DATOS EN HTML (screen0) //////////////////////
      function escribirHTML(data, num) {
        let dato = JSON.parse(data);
  
        if (dato[num].foto != null) {
          const fImagen = document.querySelector("[data-imgFallecido]");
          $("#fimagen").attr("src", "../autogestion/images/" + dato[num].foto);
        }
        
        const fNombre = document.querySelector("[data-nombreFallecido]");
        fNombre.innerHTML = dato[num].apellido;

        let iconoReligion = document.querySelector('#religionIcon');
        
        let cristianismo = "✝";
        let Judaismo = "✡";
        let Hinduismo = "ॐ";
        let Islam = "☪";
        let Budismo = "☸";
        let Taoismo = "☯";

        switch (dato[num].religion) {
          case '1':
            iconoReligion.innerHTML = cristianismo;
            break;
          case '2':
            iconoReligion.innerHTML = Judaismo;
              break;
          case '3':
            iconoReligion.innerHTML = Hinduismo;
              break;
          case '4':
            iconoReligion.innerHTML = Islam;
              break;
          case '5':
            iconoReligion.innerHTML = Budismo;
              break;
          case '6':
            iconoReligion.innerHTML = Taoismo;
              break;
          
          default:
            iconoReligion.classList.add('inactive');
              break;
        }




  
        const fInfo = document.querySelector("[data-infoFallecido]");
        fInfo.innerHTML = "El " + dato[num].fechafal + " A los " + dato[num].edad;
  
        const fInhumacion = document.querySelector("[data-cementerio]");
        fInhumacion.innerHTML =
          "<b>INHUMACION </b>" + `<b>${dato[num].cementerio}</b>`;
  
        const fInhuFechaHora = document.querySelector("[data-inhumacionFH]");
        fInhuFechaHora.innerHTML = `<b>${dato[num].fechasep}</b>` + " a las " + `<b>${dato[num].horasep}</b>`;
  
        const contenedorInfoExtra = document.querySelector(".contenedor__infoExtra");
        const codigoQR = document.querySelector("[data-qr]");
        const fraseHomenaje = document.querySelector("#fraseHomenaje");
        const body = document.querySelector("body");

        let codigoExtinto1 = dato[num].COD_EXTINTO;
        sessionStorage.setItem('inhumadoEnPantalla',codigoExtinto1);
          ajaxCondolencias(codigoExtinto1);
  
        generarQR(codigoExtinto1 + "99"); //// LLAMO A LA FUNCION QUE GENERA QR
      }

      //  console.log(localStorage.getItem("precios"));
      function mostrarCondolencia(condolencia , totalComentarios){
        let comentario = document.querySelector('[data-comentario]');
        comentario.innerHTML = '';
        let msjCondolencias = JSON.parse(condolencia);
        var inhumadoEnPantalla = sessionStorage.getItem('inhumadoEnPantalla');
        let numShow = sessionStorage.getItem(inhumadoEnPantalla);
        if (numShow == null || numShow == undefined) {
          //alert('no esta definida')
          let Seteo = sessionStorage.setItem(inhumadoEnPantalla,0);
          let numShow = sessionStorage.getItem(inhumadoEnPantalla);
          console.log(numShow);
        }
        
        let numStop = parseInt(numShow)+3;
          for (numShow; numShow < numStop; numShow++){
            if (numShow < totalComentarios) {
              console.log(numShow);
              //console.log(numStop);
                    comentario.innerHTML += `<p class="infoExtra"><strong>${msjCondolencias[numShow].mensaje} </strong><br> ${msjCondolencias[numShow].nombre} ${msjCondolencias[numShow].apellido}</p>`
                    sessionStorage.setItem(inhumadoEnPantalla,numShow);
                   // console.log(inhumadoEnPantalla);

                    }else{
                      sessionStorage.setItem(inhumadoEnPantalla,0);
                      console.log('hice el res');
                    }
                }
        }
  
    //////cambiar entre un pantalla y otra
      function cambiarPantalla(inhumados,canServicios) {
        let dato = JSON.parse(inhumados);
              $("#screen0").hide();
              $("#screen1").show();
  
          for (let num = 0; num < canServicios; num++) {
            
              if(dato[num].apellido != undefined || dato[num].apellido != null){
                $("#sala"+num).html(dato[num].apellido);
              }
  
              if (dato[num].foto != undefined) {
                $("#img"+num).attr("src", "../autogestion/images/" + dato[num].foto);
              }
              if(dato[num].sala){
                $(".salaVelatoria"+num).html(dato[num].sala);
              }
          }
          setTimeout(()=> {
              $("#screen1").hide();
              $("#screen0").show();
          },duracionSalas)
      }
    ///////////// CONSULTA BASE DE DATOS DE PAVIOTTI/////////////////
  
      function ajax() {
        $.ajax({
          url: "../../../CasaPaviottiHomenajes/back/logic/datos.php",
          type: "POST",
          datatype: "json",
          data: { opcion: 3 },
          success: function (cuenta) {
            let conteo = JSON.parse(cuenta);
            let cantServicio = conteo[0].CONTEO;
                if (cantServicio > 0) {
                  $.ajax({
                    url: "../../../CasaPaviottiHomenajes/back/logic/datos.php",
                    type: "POST",
                    datatype: "json",
                    data: { opcion: 1 },
                    success: function (data) {
                      cargarDato(data,cantServicio);
                      
                    },
                    error: function () {
                        return null;
                    },
                  });
  
                }else{
                  return null;
                }
          },
          error: function () {
            console.error('fallo llamada Ajax');
          },
        });
      }

      /////////CONSULTO A BASE LAS CONDOLENCIAS DE EL INHUMADOS
      function ajaxCondolencias(codigoExtinto){
        $.ajax({
          url: "../../../CasaPaviottiHomenajes/back/logic/datos.php",
          type: "POST",
          datatype: "json",
          data: { opcion: 4, codigo:codigoExtinto },
          success: function (cantCondolencias) {
            let cantidad = JSON.parse(cantCondolencias);
            let NumComentarios = cantidad[0].CANTCOMENTARIO;
            if (NumComentarios > 0) {
                  $.ajax({
                      url: "../../../CasaPaviottiHomenajes/back/logic/datos.php",
                      type: "POST",
                      datatype: "json",
                      data: { opcion: 5, codigo:codigoExtinto },
                      success: function (comentarios) {
                            mostrarCondolencia(comentarios,NumComentarios);
                      }
                  })
            }else{
              //// si NO HAY COMENTARIO 
              let comentario = document.querySelector('[data-comentario]');
              comentario.innerHTML = '';
              comentario.innerHTML += `<p class="infoExtra"><strong>La muerte de un ser querido es siempre dolorosa, pero insluso esa tristeza da lugar a los momentos dedicados a recordar con una sonrisa a esa persona. Te deseo que muy pronto puedas hacerlo.</strong><br> Anonimo</p>`;
            }
          }
        })
      }

      ////////////// ESCRIBE LAS CONDOLENCIAS EN LA PANTALLA ///////////////



    

    /////////////////Funcion que Genera El codigo QR (recibe el ID del Inhumado)
      function generarQR(id) {
          const contenedorQR = document.getElementById('contenedorQR');
          contenedorQR.innerHTML= '';
          const QR = new QRCode(contenedorQR,'https://paviotti.com.ar/CasaPaviottiHomenajes/envio-condolencias/index.php?condolencia='+id);
      }

          //////////// RECARGAR PAGINA
      //    fullscreen.addEventListener('click', () => {
      //      window.location.reload();
      //  })
////////// funcion  full screen

      //let botonFullScreen =  document.getElementById('fullCreen');

      //botonFullScreen.click()
      
        document.addEventListener("dblclick", ()=> {
          document.documentElement.requestFullscreen().catch((e) => {
                console.log(e);
              })
        })
    


      
  
      setInterval(ajax, 600000); ////Llamo Ajax Cada 10 Min
      ajax(); ////LLamo a Ajax por Primera Vez
    
  }); ///FIN JQUERY
