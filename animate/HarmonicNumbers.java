package animate;

import java.awt.Dimension;
import java.awt.Graphics;
import java.awt.Container;

import java.awt.Color;
import java.awt.Container;
import java.awt.Font;
import java.awt.Graphics;
import java.awt.Point;
import javax.swing.JLabel;


public class HarmonicNumbers implements Animator {
    final static double DELTA = Math.PI/50; //one turn = 100 ticks 
    final static int A = MX-50, B = MY-50, D = 10;
    final Container pan = new Panel();
    double angle = 0; //in radians

    public int doTick() {
        angle += DELTA; pan.repaint(); 
        return 50;
    }
    public Container container() {
        return pan;
    }
    public String description() {
        return "Harmony Of The Numbers";
    }
    public String author() {
        return "Ahmet Fýrat Suphesiz";
    }
   
   class Panel extends javax.swing.JPanel { //drawing
      public void paint(Graphics g) {
          char [] rakamlar={'0','1','2','3','4','5','6','7','8','9'};
          g.setColor(Color.red);
     
          g.clearRect(0, 0, 2 * MX, 2 * MY);
          Font font = new Font("Arial", Font.BOLD, 35);
          g.setFont(font);
          g.clearRect(0, 0, 2*MX, 2*MY);
         //0
          double x = MX + A * Math.cos(angle+50);
          double y = MY + B * Math.sin(angle+20);
          g.drawChars(rakamlar,0,1, (int)x,(int)y);
          g.setColor(Color.green);
         //1
          double x1 = MX + A * Math.cos(angle+20);
          double y1 = MY + B * Math.sin(angle+50);
          g.drawChars(rakamlar,1,1, (int)x1,(int)y1);
          g.setColor(Color.blue);
          //2
          double x2 = MX + A * Math.cos(angle+60);
          double y2 = MY + B * Math.sin(angle+10);
          g.drawChars(rakamlar,2,1, (int)x2,(int)y2);
          g.setColor(Color.yellow);
          //3
          double x3 = MX + A * Math.cos(angle+10);
          double y3 = MY + B * Math.sin(angle+60);
          g.drawChars(rakamlar,3,1, (int)x3,(int)y3);
          g.setColor(Color.orange);
          //4
          double x4 = MX + A * Math.cos(angle+40);
          double y4 = MY + B * Math.sin(angle+30);
          g.drawChars(rakamlar,4,1, (int)x4,(int)y4);
          g.setColor(Color.magenta);
          //5
          double x5 = MX + A * Math.cos(angle+30);
          double y5 = MY + B * Math.sin(angle+40);
          g.drawChars(rakamlar,5,1, (int)x5,(int)y5);
          g.setColor(Color.yellow);
          //6
          double x6 = MX + A * Math.cos(angle+20);
          double y6 = MY + B * Math.sin(angle+20);
          g.drawChars(rakamlar,6,1, (int)x6,(int)y6);
          g.setColor(Color.gray);
          //7
          double x7 = MX + A * Math.cos(angle+80);
          double y7 = MY + B * Math.sin(angle+5);
          g.drawChars(rakamlar,7,1, (int)x7,(int)y7);
          g.setColor(Color.cyan);
          //8
          double x8 = MX + A * Math.cos(angle+5);
          double y8 = MY + B * Math.sin(angle+80);
          g.drawChars(rakamlar,8,1, (int)x8,(int)y8);
          g.setColor(Color.black);
          //9
          double x9 = MX + A * Math.cos(angle+75);
          double y9 = MY + B * Math.sin(angle+35);
          g.drawChars(rakamlar,9,1, (int)x9,(int)y9);
          g.setColor(Color.pink);
      }
   } 
}
