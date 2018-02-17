package animate;

import java.awt.event.MouseAdapter;
import java.awt.event.MouseEvent;
import java.awt.Graphics;
import java.awt.Container;
import java.awt.Point;
import java.awt.Color;
import java.util.ArrayList;
import java.util.Random;

public class CollisionDetection implements Animator {
	final Container pan = new Panel();
	public ArrayList<Obj> objList = new ArrayList<Obj>();
	
        CollisionDetection(){
	    pan.addMouseListener(new MouseAdapter() { 
            public void mouseClicked(MouseEvent me) { 
            Random r = new Random();
            int x1 = r.nextInt(((MX*2)-30)-30) + 30;
            int y1 = r.nextInt(((MY*2)-30)-30) + 30;
	        int c = r.nextInt(30-10) + 10;
            Obj o = new Obj(new Point(x1,y1),c,randomDouble(0.0D,6.28D));
	        objList.add(o);
          } 
        });
		
	    for(int i=0;i<20;i++){
	        Random r = new Random();
            int x1 = r.nextInt(((MX*2)-30)-30) + 30;
	        int x2 = r.nextInt(((MY*2)-30)-30) + 30;
            int c = r.nextInt(25-10) + 10;
            Obj o1 = new Obj(new Point(x1,x2),c,randomDouble(0.0D,6.28D));
	        objList.add(o1);
		}
	}
	public int doTick(){
		Update();
		pan.repaint(); //Render..
        return 50;
	}
	public Container container(){
		return pan;
	}
	public String description(){
		return "Basic collision detection - Click the pane for generate a new circle!";
	}
	public String author(){
		return "Furkan Sarihan";
	}
	public void Update(){
		
		for (Obj o : objList){
		
		collisionHandler(o);
				
		if(o.getX()<0){o.setAngle(-(o.getAngle()-Math.PI));}
		else if(o.getX()>(MX*2)-(o.getRadius())*2){o.setAngle(-(o.getAngle()-Math.PI));}
		else if(o.getY()<0){o.setAngle(-o.getAngle());}
		else if(o.getY()>(MY*2)-(o.getRadius())*2){o.setAngle(-o.getAngle());}
		
		o.Move();
		}
	}
	void collisionHandler(Obj oCur){
		for (Obj o : objList){
			if(!o.equals(oCur)){
				if((o.getRadius()+oCur.getRadius())>getDist(o.getX()-oCur.getX(),o.getY()-oCur.getY())){
					setNewAngle(o,oCur);
				}
			}
		}
	}
	double getDist(double x,double y){
		return Math.sqrt((x*x)+(y*y));
	}
	void setNewAngle(Obj a, Obj b){
		double rad;
		double X = Math.abs((double)((b.getX()-a.getX())*a.getRadius())/(a.getRadius()+b.getRadius()))/a.getRadius();
		rad = Math.asin(X);
		if(b.getX()>a.getX()){b.setAngle(rad);a.setAngle(b.getAngle()-Math.PI);}
		else{a.setAngle(rad);b.setAngle((a.getAngle()-Math.PI));}
	}
	double randomDouble(double bound1, double bound2){
		double g = bound1 + new Random().nextDouble() * (bound2 - bound1);
		return g;
	}
	class Panel extends javax.swing.JPanel { //drawing
	  
	  public void paint(Graphics g) {		 
		  g.clearRect(0, 0, MX*2, MY*2);
		  for (Obj o : objList){
			g.setColor(new Color(0,120,180));
			g.fillOval(o.getX(),o.getY(),o.getRadius()*2,o.getRadius()*2);
		  }
	  }
	}
	public class Obj {
		Point P;
		int radius;
		double angle;
		double speed=8;
		
        Obj(Point po,int ra,double an){ P = po; radius= ra; angle = an; }
		
        public void setAngle(double a){ angle = a; }
		public int getX(){ return (int)P.getX(); }
		public int getY(){ return (int)P.getY(); }
		public int getRadius(){ return radius; }
		public double getAngle(){ return angle; }

		public void Move(){
			P.setLocation((double)(P.getX()+(Math.cos(angle)*speed)),
                          (double)(P.getY()-(Math.sin(angle)*speed)));
        }
	}
}