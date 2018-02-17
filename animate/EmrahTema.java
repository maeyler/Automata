package animate;

import java.awt.Color;
import java.awt.Dimension;
import java.awt.Graphics;
import java.awt.Container;

public class EmrahTema implements Animator {
    final static double DELTADunya = Math.PI/49; //one turn = 100 ticks //50 ile 3.6
    final static int ADunya = MX-50, BDunya = MY-50, DDunya = 25;
    final static double DELTAMars = Math.PI/95; //one turn = 100 ticks //50 ile 3.6
    final static int AMars = MX-50, BMars = MY-50, DMars = 15;
    final static double DELTAVenus = Math.PI/16; //one turn = 100 ticks //50 ile 3.6
    final static int AVenus = MX-50, BVenus = MY-50, DVenus = 20;
    final static double DELTAMerkur = Math.PI/12; //one turn = 100 ticks //50 ile 3.6
    final static int AMerkur = MX-50, BMerkur = MY-50, DMerkur = 10;
    final Container pan = new Panel();
    double angleDunya = 0; //in radians
    double angleMars = 0; //in radians
    double angleVenus = 0; //in radians
    double angleMerkur = 0; //in radians
    int yilDunya=0;
    int yilMars=0;
    int yilVenus=0;
    int yilMerkur=0;
    double gunDunya=0;
    double gunMars=0;
    double gunVenus=0;
    double gunMerkur=0;

    public int doTick() {
        angleDunya += DELTADunya; 
        angleMars += DELTAMars;
        angleVenus += DELTAVenus;
        angleMerkur += DELTAMerkur;
        gunDunya = gunDunya + 3.65;
        gunMars = gunMars + 3.65;
        gunVenus = gunVenus + 3.65;
        gunMerkur = gunMerkur + 3.65;
        if(gunMerkur>86){
            gunMerkur=0;
            yilMerkur++;
        }
        if(gunVenus>123){
            gunVenus=0;
            yilVenus++;
        }
        if(gunMars>685){
            gunMars=0;
            yilMars++;
        }
        if(gunDunya>363){
            gunDunya=0;
            yilDunya++;
        }
        
        pan.repaint(); 
        return 100;
    }
    public Container container() {
        return pan;
    }
    public String description() {
        return "Movements Of Mercury, Earth, Venus and Mars";
    }
    public String author() {
        return "Emrah Y. TEMA";
    }
   
   class Panel extends javax.swing.JPanel { //drawing
      public void paint(Graphics g) {
          g.clearRect(0, 0, 2*MX, 2*MY);
          
          //Güneþ
          g.setColor(Color.YELLOW);
          g.fillOval(300, 220,50,50);
          
          //Dünya
          g.setColor(Color.BLUE);
          double xDunya = MX + ADunya * Math.cos(angleDunya)/100*55;
          double yDunya = MY + BDunya * Math.sin(angleDunya)/100*60;
          g.fillOval((int)xDunya, (int)yDunya, DDunya, DDunya);
          
          //Mars
          g.setColor(Color.RED);
          double xMars = MX + AMars * Math.cos(angleMars);
          double yMars = MY + BMars * Math.sin(angleMars);
          g.fillOval((int)xMars, (int)yMars, DMars, DMars);
          
          //Venüs
          g.setColor(Color.PINK);
          double xVenus = MX + AVenus * Math.cos(angleVenus)/100*70;
          double yVenus = MY + BVenus * Math.sin(angleVenus)/100*75;
          g.fillOval((int)xVenus, (int)yVenus, DVenus, DVenus);
          
          //Merkür
          g.setColor(Color.ORANGE);
          double xMerkur = MX + AMerkur * Math.cos(angleMerkur)/100*20;
          double yMerkur = MY + BMerkur * Math.sin(angleMerkur)/100*25;
          g.fillOval((int)xMerkur, (int)yMerkur, DMerkur, DMerkur);
      
          //Yýl ve Gün
          g.setColor(Color.BLACK);
          String str = "Mars: "+String.valueOf(yilMars)+" Yýl "+String.valueOf((int)gunMars)+" Gün | ";
          str += "Dünya: "+String.valueOf(yilDunya)+" Yýl "+String.valueOf((int)gunDunya)+" Gün | ";
          str += "Venüs: "+String.valueOf(yilVenus)+" Yýl "+String.valueOf((int)gunVenus)+" Gün | ";
          str += "Merkür: "+String.valueOf(yilMerkur)+" Yýl "+String.valueOf((int)gunMerkur)+" Gün";
          g.drawString(str, 20, 460);
      }
   } 
}
