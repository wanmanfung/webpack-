attribute vec2 a_position;
void main(){
    vec2 transPo = a_position / (3200.0, 3200.0);
    vec2 po = (transPo * 2.0) - 1.0; 
    gl_Position = vec4(po, 0 , 1);
}