const articles = [
  {
    id: 1,
    title: "Vanilla JS SPA using web-components",
    author: "Allan Bogh",
    date: "2020-11-18T09:50:23.583Z",
    category: 'Articles',
    markdown: `
The **Open Code Project** is being developed as an SPA using Vanilla JS instead of a framework like React or Angular.
    `
  },
  {
    id: 2,
    title: "1958 Edsel Computerized Shifter Motor",
    author: "Allan Bogh",
    date: "2020-11-18T09:50:23.583Z",
    category: 'Articles',
    markdown: `
The [**1958 Edsel**](http://www.edsel.com/pages/edsel58.htm) came with a Teletouch transmission that used an analog shifter motor.
    `
  },
  {
    id: 3,
    title: 'Dell Precision 5530',
    author: 'Allan Bogh',
    date: '2020-11-23T20:34:23.583Z',
    category: 'Reviews',
    markdown: `
The [**Dell Precision 5530**](https://www.dell.com/en-us/work/shop/dell-laptops-and-notebooks/precision-5530-mobile-workstation/spd/precision-15-5530-laptop) is a decent laptop that can run Linux, 
however some designer decided to place the video camera and microphone at the bottom of the screen. Not only does this make the camera point straight up the nose of the user, allowing viewers to see
their... well, uncleaned nose... but it also makes the user's chin appear GIGANTIC! A technical problem with placing the microphone next to the bottom of the screen is that the CPU fan blows out the back of the computer,
making noise reduction techniques employed by programs like Zoom fail. The user will constantly have to mute their microphone to avoid feedback and unnecessary fan noise while on calls. This is especially apparent when sharing a 
screen, because screen sharing uses a ton of processing power to create and transmit the screen images. A workaround is to set the screen sharing rate to 10FPS, allowing the CPU to cool down a little before sending the next image.

The spacebar rocker is also weak, so keypresses on the far edges of the spacebar key will sometimes not register, so you have to be extra forceful and centered with the spacebar keypresses.

I give the Dell Precision 5530 an D for being designed with a camera at the bottom of the screen. It got a little bump for being able to run Ubuntu fairly well. At least it's better than one other Dell laptop that was produced WITHOUT A CAMERA! Why?
    `
  }
];

module.exports = articles;
