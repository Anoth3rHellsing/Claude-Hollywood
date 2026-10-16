import json
L=[
("B0","0:00","Apertura","L01","¡Hola! Bienvenidos a Claude Hollywood ciento uno. Antes de empezar, un secreto: nada de lo que ven es un video."),
("B0","0:00","Apertura","L02","No hay cámara, ni actores, ni dibujos guardados. Solo código… y yo, Aguada: una tacita con boina."),
("B1","0:20","Todo es código","L03","Miren. Si congelo el mundo, aparece su esqueleto: una cámara en tres dimensiones, hecha con matemáticas."),
("B1","0:20","Todo es código","L04","Sesenta veces por segundo, Claude calcula dónde va cada columna, cada hoja y cada charco… y lo vuelve a pintar desde cero."),
("B2","0:50","La acuarela","L05","¿Y la acuarela? Empieza como una figura simple. Claude la deforma un poquito, una y otra vez."),
("B2","0:50","La acuarela","L06","Luego apila veinte capas casi transparentes, como un pintor de verdad. Así salen los bordes húmedos y el papel que respira."),
("B2","0:50","La acuarela","L07","Ninguna imagen viene de otro programa. Todo esto lo pinta el código."),
("B3","1:20","Lo que ya hicimos","L08","Y no es la primera vez. En estos cristales guardo algunas películas que ya hicimos."),
("B3","1:20","Lo que ya hicimos","L09","Un samurái bajo la lluvia. Tres magos y un juramento roto. Y este mismo invernadero… pero de noche, en pleno duelo."),
("B4","1:50","El mundo reacciona","L10","Yo no me adapto al mundo: soy de píxeles. Pero el mundo sí reacciona a mí."),
("B4","1:50","El mundo reacciona","L11","Si piso un charco, el agua se mueve. Y si agarro esta piedra y la lanzo…"),
("B4","1:50","El mundo reacciona","L12","…Uy. Eso no estaba en el guion."),
("B4","1:50","El mundo reacciona","L13","Pero fíjense: cada vidrio cae por su cuenta. La física también es código."),
("B5","2:25","El sonido","L14","¿Y el sonido? Las hojas, el viento y la música también los fabrica el código, nota por nota."),
("B5","2:25","El sonido","L15","Lo único que viene de afuera es mi voz, gracias a ElevenLabs."),
("B6","2:45","Tu turno","L16","¿Quieres hacer la tuya? Llena el tiquete: la idea, los personajes y lo que no se puede tocar."),
("B6","2:45","Tu turno","L17","Elige un modo: control, auto o asistido. Y Claude se pone a pintar."),
("B6","2:45","Tu turno","L18","Fin de la primera clase. ¡Nos vemos en la próxima!"),
]
out=[dict(bloque=b,desde=d,titulo=t,id=i,texto=x,chars=len(x),seg_aprox=round(len(x)/14.5,1)) for b,d,t,i,x in L]
tot=sum(o['chars'] for o in out)
json.dump(dict(voz=dict(nombre="Fruna - Playful, mischievous, sweet",voice_id="2CGcaXd1E04jesxY7nfq"),total_chars=tot,lineas=out),open('guion.json','w',encoding='utf-8'),ensure_ascii=False,indent=1)
print(tot, round(tot/14.5),'s de voz')
for o in out: print(o['id'],o['chars'],o['seg_aprox'])
