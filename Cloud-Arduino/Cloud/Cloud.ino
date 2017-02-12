#include <Adafruit_NeoPixel.h>
#ifdef __AVR__
  #include <avr/power.h>
#endif

#define PIN 6

#define NUM_LEDS 30

#define BRIGHTNESS 100

Adafruit_NeoPixel strip = Adafruit_NeoPixel(NUM_LEDS, PIN, NEO_GRBW + NEO_KHZ800);

int gamma[] = {
    0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
    0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  1,  1,  1,  1,
    1,  1,  1,  1,  1,  1,  1,  1,  1,  2,  2,  2,  2,  2,  2,  2,
    2,  3,  3,  3,  3,  3,  3,  3,  4,  4,  4,  4,  4,  5,  5,  5,
    5,  6,  6,  6,  6,  7,  7,  7,  7,  8,  8,  8,  9,  9,  9, 10,
   10, 10, 11, 11, 11, 12, 12, 13, 13, 13, 14, 14, 15, 15, 16, 16,
   17, 17, 18, 18, 19, 19, 20, 20, 21, 21, 22, 22, 23, 24, 24, 25,
   25, 26, 27, 27, 28, 29, 29, 30, 31, 32, 32, 33, 34, 35, 35, 36,
   37, 38, 39, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 50,
   51, 52, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 66, 67, 68,
   69, 70, 72, 73, 74, 75, 77, 78, 79, 81, 82, 83, 85, 86, 87, 89,
   90, 92, 93, 95, 96, 98, 99,101,102,104,105,107,109,110,112,114,
  115,117,119,120,122,124,126,127,129,131,133,135,137,138,140,142,
  144,146,148,150,152,154,156,158,160,162,164,167,169,171,173,175,
  177,180,182,184,186,189,191,193,196,198,200,203,205,208,210,213,
  215,218,220,223,225,228,231,233,236,239,241,244,247,249,252,255 };

String incomingByte;   // for incoming serial data
String temp;
bool skip = true;
int r, g, b;
void setup() {
  Serial.begin(9600);
  // This is for Trinket 5V 16MHz, you can remove these three lines if you are not using a Trinket
  #if defined (__AVR_ATtiny85__)
    if (F_CPU == 16000000) clock_prescale_set(clock_div_1);
  #endif
  // End of trinket special code
  strip.setBrightness(BRIGHTNESS);
  strip.begin();
  strip.show(); // Initialize all pixels to 'off'
}

void loop() {
  // read the incoming byte:
  if (Serial.available() > 0) {
    incomingByte = Serial.readString();
    incomingByte.trim();
  }

  if (incomingByte == "0") { //don't reset val, this state persists
    dim_state();
  } else if (incomingByte == "1") { //don't reset val, this state persists
    full_bright_state(255, 255, 255, 255);
  } else if (incomingByte == "2") {
    full_strip_lightning();
  } else if (incomingByte == "3") {
    strip_top_lightning();
  } else if (incomingByte == "4") {
    strip_middle_lightning();
  } else if (incomingByte == "5") {
    strip_bottom_lightning();
  } else if (incomingByte == "6") {
    mixed_strip_lightning();
    mixed_strip_lightning();
  } else if (incomingByte == "7") {
    full_bright_state(255, 0, 0, 0);
  } else if (incomingByte == "8") {
    full_bright_state(0, 255, 0, 0);
  } else if (incomingByte == "9") {
    full_bright_state(0, 0, 255, 0);
  } else if (incomingByte == "10") {
    full_bright_state(255, 0, 0, 0);
    delay(1000);
    full_bright_state(0, 255, 0, 0);
    delay(1000);
    full_bright_state(0, 0, 255, 0);
    delay(1000);
  } else if (incomingByte == "11") {
    full_bright_state(255, 0, 255, 0);
  } else if (incomingByte == "12") {
    rainbow(1,1);  //don't reset val, this state persists
  } else if (incomingByte == "13") {
    rainbow(5,1);  //don't reset val, this state persists
  } else if (incomingByte == "14") {
    rainbow(15,1); //don't reset val, this state persists
  } else if (incomingByte == "15") {
    full_bright_state(255,200,0,40);
  } else if (incomingByte == "16") {
    full_bright_state(255,90,0,20);
  } else if (incomingByte == "17") {
    full_bright_state(255,35,0,10);
  } else if (incomingByte == "18") {
    full_bright_state(0,35,255,40);
  } else if (incomingByte[0] == '#') {
    r = convert(incomingByte[1], incomingByte[2]);
    g = convert(incomingByte[3], incomingByte[4]);
    b = convert(incomingByte[5], incomingByte[6]);
    full_bright_state(r, g, b, 0);
  } else {
    off();
  }
}

int convert(char a, char b) {
  int r = 0x0;
  switch (a) {
    case '1':
    r += 16 * 1;
    break;
    case '2':
    r += 16 * 2;
    break;
    case '3':
    r += 16 * 3;
    break;
    case '4':
    r += 16 * 4;
    break;
    case '5':
    r += 16 * 5;
    break;
    case '6':
    r += 16 * 6;
    break;
    case '7':
    r += 16 * 7;
    break;
    case '8':
    r += 16 * 8;
    break;
    case '9':
    r += 16 * 9;
    break;
    case 'A':
    r += 16 * 10;
    break;
    case 'B':
    r += 16 * 11;
    break;
    case 'C':
    r += 16 * 12;
    break;
    case 'D':
    r += 16 * 13;
    break;
    case 'E':
    r += 16 * 14;
    break;
    case 'F':
    r += 16 * 15;
    break;
  }
  switch (b) {
    case '1':
    r += 1;
    break;
    case '2':
    r += 2;
    break;
    case '3':
    r += 3;
    break;
    case '4':
    r += 4;
    break;
    case '5':
    r += 5;
    break;
    case '6':
    r += 6;
    break;
    case '7':
    r += 7;
    break;
    case '8':
    r += 8;
    break;
    case '9':
    r += 9;
    break;
    case 'A':
    r += 10;
    break;
    case 'B':
    r += 11;
    break;
    case 'C':
    r += 12;
    break;
    case 'D':
    r += 13;
    break;
    case 'E':
    r += 14;
    break;
    case 'F':
    r += 15;
    break;
  }
  return r;
}

void off() {
  uint16_t i;
  for(i = 0; i < strip.numPixels(); i++) {
      strip.setPixelColor(i, strip.Color(0,0,0,0));
  }
  strip.show();
}

void dim_state() {
  uint16_t i;
  for(i = 0; i < strip.numPixels(); i+= 4) {
      strip.setPixelColor(i, strip.Color(1,1,1,50));
      strip.setPixelColor(i + 1, strip.Color(0,0,0,0));
      strip.setPixelColor(i + 2, strip.Color(0,0,0,0));
      strip.setPixelColor(i + 3, strip.Color(0,0,0,0));
  }
  strip.show();
}

void full_bright_state(int r, int g, int b, int gm) {
  uint16_t i;
  for(i = 0; i < strip.numPixels(); i++) {
      strip.setPixelColor(i, strip.Color(r, g, b, gm));
  }
  strip.show();
}

void lightning() {
  full_bright_state(255, 255, 255, 255);
}

void lightning_top_third() {
  uint16_t i;
  for(i = strip.numPixels() / 3 * 2; i < strip.numPixels(); i++) {
    //strip.setPixelColor(i, strip.Color(255,180,0,10)); // Nice yellow color
    strip.setPixelColor(i, strip.Color(255,255,255,255));
  }
  strip.show();
}

void lightning_middle_third() {
  uint16_t i;
  for(i = strip.numPixels() / 3 + 1; i < strip.numPixels() / 3 * 2; i++) {
    //strip.setPixelColor(i, strip.Color(255,180,0,10)); // Nice yellow color
    strip.setPixelColor(i, strip.Color(255,255,255,255));
  }
  strip.show();
}

void lightning_bottom_third() {
  uint16_t i;
  for(i = 0; i < strip.numPixels() / 3; i++) {
    //strip.setPixelColor(i, strip.Color(255,180,0,10)); // Nice yellow color
    strip.setPixelColor(i, strip.Color(255,255,255,255));
  }
  strip.show();
}

void full_strip_lightning() {
  dim_state();
  lightning();
  delay(250);
  dim_state();
  delay(75);
  lightning();
  delay(15);
  dim_state();
  delay(75);
  lightning();
  delay(75);
  lightning();
  delay(150);
  dim_state();
  delay(75);
  lightning();
  delay(75);
  dim_state();
}


void mixed_strip_lightning() {
  dim_state();
  lightning_top_third();
  delay(250);
  dim_state();
  delay(75);
  lightning_bottom_third();
  delay(15);
  dim_state();
  delay(75);
  lightning_middle_third();
  delay(75);
  lightning();
  delay(150);
  dim_state();
  delay(75);
  lightning_bottom_third();
  delay(75);
  dim_state();
}

void strip_top_lightning() {
  dim_state();
  lightning_top_third();
  delay(250);
  dim_state();
  delay(75);
  lightning_top_third();
  delay(15);
  dim_state();
  delay(75);
  lightning_top_third();
  delay(75);
  lightning_top_third();
  delay(150);
  dim_state();
  delay(75);
  lightning_top_third();
  delay(75);
  dim_state();
}

void strip_middle_lightning() {
  dim_state();
  lightning_middle_third();
  delay(250);
  dim_state();
  delay(75);
  lightning_middle_third();
  delay(15);
  dim_state();
  delay(75);
  lightning_middle_third();
  delay(75);
  lightning_middle_third();
  delay(150);
  dim_state();
  delay(75);
  lightning_middle_third();
  delay(75);
  dim_state();
}

void strip_bottom_lightning() {
  dim_state();
  lightning_bottom_third();
  delay(250);
  dim_state();
  delay(75);
  lightning_bottom_third();
  delay(15);
  dim_state();
  delay(75);
  lightning_bottom_third();
  delay(75);
  lightning_bottom_third();
  delay(150);
  dim_state();
  delay(75);
  lightning_bottom_third();
  delay(75);
  dim_state();
}

// Input a value 0 to 255 to get a color value.
// The colours are a transition r - g - b - back to r.
uint32_t Wheel(byte WheelPos) {
  WheelPos = 255 - WheelPos;
  if(WheelPos < 85) {
    return strip.Color(255 - WheelPos * 3, 0, WheelPos * 3,0);
  }
  if(WheelPos < 170) {
    WheelPos -= 85;
    return strip.Color(0, WheelPos * 3, 255 - WheelPos * 3,0);
  }
  WheelPos -= 170;
  return strip.Color(WheelPos * 3, 255 - WheelPos * 3, 0,0);
}

uint8_t red(uint32_t c) {
  return (c >> 8);
}
uint8_t green(uint32_t c) {
  return (c >> 16);
}
uint8_t blue(uint32_t c) {
  return (c);
}

void rainbow(uint8_t wait, int rainbowLoops) {
  float fadeMax = 100.0;
  int fadeVal = 100;
  uint32_t wheelVal;
  int redVal, greenVal, blueVal;

  for(int k = 0 ; k < rainbowLoops ; k ++){ 
    for(int j=0; j<256; j++) { // 5 cycles of all colors on wheel
      for(int i=0; i< strip.numPixels(); i++) {
        wheelVal = Wheel(((i * 256 / strip.numPixels()) + j) & 255);
        redVal = red(wheelVal) * float(fadeVal/fadeMax);
        greenVal = green(wheelVal) * float(fadeVal/fadeMax);
        blueVal = blue(wheelVal) * float(fadeVal/fadeMax);
        strip.setPixelColor( i, strip.Color( redVal, greenVal, blueVal ) );
      }
      strip.show();
      delay(wait);
    }
  }
}

