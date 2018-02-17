/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package animate;


import java.awt.Graphics;
import java.awt.Container;
import java.awt.Font;
import java.awt.Color;
import java.util.Random;

public class SelimT implements Animator {
    
    final Container pan = new Panel();
    int counter = 0;
    
    public int doTick() {
        pan.repaint();
        return 200;
    }
    
    public Container container() {
        return pan;
    }
    
    public String description() {
        return "Ekranda random görünen random harfler";
    }
    
    public String author() {
        return "Selim Tural";
    }
    
    class Panel extends javax.swing.JPanel { //drawing
        
        @Override
        public void paint(Graphics g) {
            g.clearRect(0, 0, 2 * MX, 2 * MY);
            Font font = new Font("Arial", Font.BOLD, 60);
            
            g.setFont(font);
            String sel = "";
            Random st = new Random ();
            int k = st.nextInt(65,123);
            char harf = Convert.ToChar(k);
            sel += harf;
            int a = st.nextInt(MX);
            int b = st.nextInt(MY);
            g.setColor(Color.blue);
            g.drawString(sel, a, b);
            
        }
    }
}
