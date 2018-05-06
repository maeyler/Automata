
## Regular Expression

Regular expressions also known as "Duzenli Ifadeler" are keys for created to describe a search model. It can be apply texts,sentences even words. Thus, it can be understood from the easy way whether the searched expression is in the searched text.
	There are more than one purpose of using Regular Expressions
	
 - To find out whether a given pattern exists in the text
 - If it exist ,we can find how many are there 
 - It helps us to replace words in texts with new words.

There are some general usages that should be known when creating the pattern to be searched in the text.We will see these usages and do practice with examples.Matches found in the search result will be indicated by quotation marks.

 **1)Usage of Box Brackets:** It used to search for letters in box brackets in text.
 
**Example 1.1:** Let's consider our text as "helikopter havalanıyor" and our pattern as [hit]. In this case,the given text will match the letters h,i, t. So the result will be 'h'el'i'kop't'er 'h'avalanıyor.
What if our pattern consists of numbers ? Let's choose a pattern of numbers and apply it.

 **Example 1.2:** Let's consider our text as "Istanbul 1453 yılında fethedilmiştir." and Out pattern as [137]. This time we are looking for numbers, the result will change and only if the numbers in parentheses in the text will be enclosed in quotation marks.Numbers are surrounded by square brackets so we will search the numbers one by one.
And Our result will be " Istanbul '1'45'3'. Cause we are only looking for 1 , 3 and 7.

**2)Usage of Normal parentheses**: when you use square brackets, you only search for letters, but if you use regular parentheses, you search for the expression in parentheses as a whole.

Example 2.1: Out pattern is (kap) , In this condition ıt will find every word which include "kap" on inside.
Let's consider our text as "İçeri girdiğinde kapıyı kapat". In this case, as mentioned above, we will search for the word "kap" in the words in the text.
The result will be " İçeri girdiğinde 'kap'ıyı 'kap'at".

As we did in our first rule, let's assume that our pattern is not composed of letters but numbers.

**Example 2.2** : Let's consider our text as "Fenerbahçe Spor Kulübü 1907 yılında kurulmuştur" and Out pattern as (1907). And we are looking only 1907 now. Not 1,9,0,7 because We are using  Normal Paranthesis.
Under these conditions, the result will be "Fenerbahçe Spor Kulübü '1907' yılında kurulmuştur."

**3)Usage of Curly Brackets**: Specifies the number of times the phrase needs to be repeated.

**Example 3.1** :Let's consider our text as "mermerler su geçirmezdir." and  our pattern as {mer}(2). In this case, we will search for the word "mer", which is repeated 	consecutively  twice in the text.
The result will be " 'mermer'ler su geçirmezdir." 
What will be happen if we want a specific repeat range ? What do we do if we say at least 1 maximum 2times ?
We can specify the number of repetitions in curly brackets with a comma. It will be like this (pattern){min,max} Let's try this.

**Example 3.2** : Let's consider our text as "Helikopterler patapatapatapata diye ses çıkarırlar. and Now Our pattern will be (pata){1,2}
The result will be "Helikopterler 'patapata''patapata' diye ses çıkarırlar". First, he looks at maximum range. If he can't find it at maximum range, he's reducing the range until minimum range.


**4) Usage of Point(Dot)**: means any character. You can use it instead of every character.You might think of it as a joker.

**Example 4.1 :** Let's consider our text as "elmanın içinde bir sürü vitamin vardır." and  our pattern as (elm.). If the "dot" is the fourth letter after three letters, as in this example. Anything could come up there.Like a number,like a character,like a sign. If the point was at pattern. This time there was going to be anything to do with it. The result will be "'elma'nın içinde bir sürü vitamin vardır." As you can see, the letter "A" is used instead of the period after the third letter.

**5) Usage of Base Sign (^):** This sign adds negativity to our pattern. This means that when this pointer is used,expressions such as letters, numbers, are not searched in the text. 

**Example  5.1** : Let's consider our text as "Van Gölü" and  our pattern as [^aölg]. 
The result will be  " 'V'a'n' göl'ü' ". We found matches other than the letters , whose are specified , as requested.

**6) Usage of Sum sign** :  means one or more of any character in instead paranthesis or any word.

**Example 6.1 :** Let's consider our text as "Sokak lambaları sabah kaddar yanar" and  our pattern as [kd]+. 
The result will be " So'k'a'k' lambaları sabah 'k'a'dd'ar yanar ". As you can see, the letter D is more than one, so it took them as a group.

 **7) Usage of Range :** If we want to search for more letters, we can use the range.
 
 **Example 7.1)** : If we want to search the letters from A to Z , We can use range instead of writing 29 letters one by one..  Let's consider our text as "A b c d e f g h j k l m n " and  our pattern as [A-Z]. The result will be "A b c d e f g h j k l m n " 
 
**8) Usage of BackSlash (\)** : It usually uses with special commands. Like \w, \W , \d , \D and \.  We will see different usage of \
**8.1) Usage of \d** : means any digits whose are between of 0 and 9  in text.

**Example 8.1.1** : Let's consider our text as "Haftanın 4 günü günde 8 saat işe gidiyor" and  our pattern as \d . In this condition, we only want numbers.
So the result will be Haftanın '4' günü günde '8' saat işe gidiyor

**8.2) Usage of \D** : opposite of /d . no digits in text.

**Example 8.2.1)** : Let's consider our text as "3 ev 4 ok" and  our pattern as \D . 
The result will be " 3 'e''v' 4 'o''k' ".

**8.3) Usage of \w** : means metacharacter. It can be a-z, A-Z, 0-9 even _ . 

**Example 8.3.1)** : Let's consider our text as "Ben $ geldim € " and  our pattern as \w. 
The result will be " 'B''e''n' $ 'g''e''l''d''i''m' € "

**8.4 )Usage of \W** : means any metacharacter, It can be punctation marks,special marks like $ , # etc.

**Example 8.4.1)** : Let's consider our text as "Ben $ geldim € " and  our pattern as \W. 
The result will be "Ben '$' geldim '€'"

I have some questions for you but I won't write answers of those questions, Those answers will be inside of my java program :)

**Q1 )** Type a pattern to search for "67414".

**Q2 )** Type a pattern to search for the remaining letters except for the "aghtr" letters.

**Q3 )** Type 2 different patterns to search for "baba".

**Q4 )** Type a pattern to search for ! , . 

**There is a link for my program which helps you to search patterns.**

[**Download link is here**](https://github.com/TolgaTEZEL/Automata/raw/master/docs/regexp/TolgaTezel_PatternSearch.jar)

 
**This program is written on Java Language and It accepts Java language**

**This narration  and Pattern Searcher Program are done by Tolga TEZEL**




## REFERENCES 

[http://patternbasedwriting.com/elementary_writing_success/paragraph-examples/](http://patternbasedwriting.com/elementary_writing_success/paragraph-examples/)

[https://www.goodreads.com/topic/show/1470148-random-passages-paragraphs](https://www.goodreads.com/topic/show/1470148-random-passages-paragraphs)

[https://medium.com/factory-mind/regex-tutorial-a-simple-cheatsheet-by-examples-649dc1c3f285](https://medium.com/factory-mind/regex-tutorial-a-simple-cheatsheet-by-examples-649dc1c3f285)

[https://regexr.com/](https://regexr.com/)

[https://regexone.com/](https://regexone.com/)

[https://www.regular-expressions.info/tutorial.html](https://www.regular-expressions.info/tutorial.html)



