# Happy Drink · Menú Digital

Menú interactivo estático, optimizado para celular, con carrito y envío de pedido a WhatsApp. No requiere servidor, base de datos ni servicios de pago.

## 1. WhatsApp configurado

Se incluyen dos números receptores de pedidos: **56 4524 9140** y **56 4144 9239**. En el carrito el cliente elige a cuál de los dos enviar el pedido. Se abre WhatsApp con el pedido precargado y el cliente debe pulsar Enviar.

Para modificar los números o sus etiquetas, edita `whatsappNumeros` en `config.js`. Usa `52` seguido de los 10 dígitos mexicanos, sin espacios.

## 2. Publicar gratis en GitHub Pages

1. Inicia sesión en https://github.com y crea un repositorio nuevo, por ejemplo `happy-drink-menu`, de tipo **Public**.
2. Sube **todos los archivos y la carpeta `assets`** del ZIP a la raíz del repositorio (no subas solo el ZIP).
3. En el repositorio abre **Settings → Pages**.
4. En **Build and deployment** elige **Deploy from a branch**, selecciona `main` y `/ (root)` y guarda.
5. GitHub mostrará la URL del menú, normalmente `https://TU-USUARIO.github.io/happy-drink-menu/`. La publicación puede tardar unos minutos.
6. Genera un código QR apuntando a la URL publicada.

**Nota:** GitHub Pages publica el sitio como contenido público. Revisa sus condiciones de uso para sitios comerciales antes de utilizarlo como canal permanente de pedidos. Si lo prefieres, los mismos archivos funcionan en Cloudflare Pages o Netlify.

## 3. Editar productos

En `app.js`, el arreglo `P` contiene productos. Cada entrada tiene:

`['id','Nombre',precio,'categoria','descripcion','archivo-foto']`

Ejemplo: `['papas','Papas a la francesa',60,'snacks','','papas.jpg']`.

Las fotografías incluidas son **recortes de la imagen de tu menú impreso**: no son fotografías individuales originales ni representan necesariamente cada producto con exactitud. Puedes reemplazarlas por fotos propias conservando los nombres de archivo en `assets` y actualizando `app.js`. Los productos sin foto se muestran con ilustración emoji.

## 4. Revisión antes de publicar

Verifica precios, sabores, opciones y disponibilidad. Las variantes y sus precios se basan en el cartel facilitado. Se añadieron selecciones para facilitar el pedido; confirma que las opciones correspondan con lo que preparas.

No se cobra en línea. El total es estimado y el pedido se confirma por WhatsApp. No hay panel de administración ni almacenamiento de pedidos.


## Pedidos por WhatsApp
El pedido se prepara exclusivamente para **+52 56 4524 9140**. Al confirmar se abre una sola conversación con folio aleatorio, fecha y hora del dispositivo y detalle del carrito. El cliente debe pulsar **Enviar** en WhatsApp. El folio no es secuencial ni garantiza unicidad global y la hora depende del reloj del dispositivo.
