#  NFA to DFA
First of all, I want to explain you what the finite automata (FA) is. Then i will define NFA and DFA after them i will tell how to convert NFA to DFA. So let's start.

## Finite Automata ( FA )
A finite automaton (FA) is a simple idealized machine used to recognize patterns within input taken from some character set or alphabet. The job of an FA is to  _accept_  or  _reject_  an input depending on whether the pattern defined by the FA occurs in the input.
So we can say Finite Automata(FA) is the simplest machine to recognize patterns.

A Finite Automata consists of the following :
Formal specification of machine is : { Q, ∑, q, F, δ }.
Q : Finite set of states.
∑ : set of Input Symbols.
q : Initial state.
F : set of Final States.
δ : Transition Function.

We can represent a FA graphically, with nodes for states, and arcs for transitions.
We execute our FA on an input sequence as follows:
-   Begin in the start state
-   If the next input char matches the label on a transition from the current state to a new state, go to that new state
-   Continue making transitions on each input
    -   If no move is possible, then stop
    -   If in accepting state, then accept

FA is characterized into two types:

## Deterministic Finite Automata ( DFA )
Deterministic finite automata - a state machine for which each transition for a state is uniquely determined by it's input symbol as each state can only have a single move per input symbol.
In a DFA, for a particular input character, machine goes to one state only. A transition function is defined on every state for every input symbol. Also in DFA null (or ε) move is not allowed, DFA can not change state without any input character.

## Non-deterministic Finite Automata ( NFA )
Non-deterministic finite automata - a state machine that can have states with multiple transitions for the same input symbol, and that can make "epsilon" moves, for no input at all.
NFA is similar to DFA except following additional features:
1. Null (or ε) move is allowed i.e., it can move forward without reading symbols.
2. Ability to transit to any number of states for a particular input.
However, these above features don’t add any power to NFA. If we compare both in terms of power, both are equivalent.
Simply, all automatas that do not comply with DFA rules can be called NFA.

Due to above additional features, NFA has a different transition function, rest is same as DFA.
One important thing to note is, _**in NFA, if any path for an input string leads to a final state, then the input string accepted**_.

**Some Important Points:**
1. Every DFA is NFA but not vice versa.
2. Both NFA and DFA have same power and each NFA can be translated into a DFA.
3. There can be multiple final states in both DFA and NFA.
3. NFA is more of a theoretical concept.

# From NFA to DFA Conversion
To facilitate understanding of NFA, we convert it to DFA.
Let's make an example to make it easy to understand.
 Regex of this example is (ab + abb)*.
- Q : { s, p, q }
- ∑ : { a, b }
- q : { s }
- F : { s }
- δ :

|   δ   | a     | b        |
|:----:|-------|----------|
| ->*s | { p }  |  Ø     |
| p    |   Ø    | { s, p } |
| q    |   Ø    | { s }    |


Now, lets analyze our example.
Our initial state is { s } .
There is only one final state and its state { s } again.
So in our transition table, we put "->" for showing the initial state. And we put " * " for showing the final states.
There is empty cluster sign in our table. So that means this table not belongs to DFA. So it belongs to NFA.
And there is multiple move choices for p states b symbol. In DFA, it's input symbol as each state can only have a single move per input symbol. So this table not belongs to DFA. Then its NFA.


 - Now, lets see NFA Transition Diagram of the example.

> Open the application that i have made.. And select the first regex which is (ab + abb)*.When you select the regex, you can see the NFA diagram at below.

 [Click here to download the application](https://github.com/EnesKy/Automata/raw/master/docs/fa/NFAtoDFA.jar)

 ![](https://lh3.googleusercontent.com/a3izzk9VwED5ueMPYQP1upryyO0xDpQ4gfiGQfTQY_YOPZKs4NV5fmhO8OhulDQ4D7V4escyhTAe "NFA Diagram")

Let's convert it to DFA.
 - As you can see "s" state is covered with two circles which means its the final state and there is a arrow points the "s" state which means its the initial state. So we have to start from "s" state at our DFA diagram and table.

> Click Go One Step or Move Automatically button

![enter image description here](https://lh3.googleusercontent.com/2P3Vcxe66RaQZz85r0teDK8Oqcik190Pj6Xw_16_joCJQzL6LXdsSiA8x2U5XxlqlRtBvCAIkCL7)

 - Now we have our initial state so we looking at the NFA diagram and searching for state "s" 's "a" move which is only "p". Then we have our another state "p".


> Click Go One Step button or if you clicked Move Automatically button wait 2 sec.

![enter image description here](https://lh3.googleusercontent.com/W-YOYCF8fvIh_m3iRUJYWfXh7kIIUSJMoDUaXp1lYP6MM3gNyBq5YynwYKaFYgCXOuz0yI5oH5yh)

- Then we are looking for the state s' s "b" move from NFA Diagram and there is no "b" move for state s. So our DFA Diagram is not changing.

>  Click Go One Step button or if you clicked Move Automatically button wait 2 sec.

- We had look at every move of state s and its done. So we are going to at the other state's moves. We have state p right now. Then we are looking for the state p' s "a" move and there is no "a" move for state p. So our diagram is not changing again.

>  Click Go One Step button or if you clicked Move Automatically button wait 2 sec.

 - Now we are looking to the move "b" of state "p" and there is two different state which are "s" and "q". So our new state is "sq" and "p" state shows "sq" state with move "b".

>  Click Go One Step button or if you clicked Move Automatically button wait 2 sec.

![enter image description here](https://lh3.googleusercontent.com/n_8AbkvjU-4pRKoCeVRPN52pMihHfvERnPr8ascRRw47R0DRvwIZdXzsSuFWnhTy3rLl-tT0JLGu)

 - Our new state is "sq" and we are going to look at it's moves now. State "sq" 's move "a" leads us to state "p".
 >  Click Go One Step button or if you clicked Move Automatically button wait 2 sec.

![enter image description here](https://lh3.googleusercontent.com/ckTglIVsdCpHrKW21sAIrgZPFmxXvHHlP3lOqd5lPdsgEp4Xh_TH772ch_9vNP5MVQHaNZxujL91)

 - State "sq" 's move "b" leads us to state "s".
 >  Click Go One Step button or if you clicked Move Automatically button wait 2 sec.

![enter image description here](https://lh3.googleusercontent.com/VP9FCNUaL7QMrEUjFt5x2Fr-Thi7HmL3SGyeIoqYg6-XCy1H8lCFpihsKWyGvLOn3qgwI96CGZP6)

- Now we looking at state "sq" 's ways and searching for unused states. But "p" and "s" states are already defined. So that means our DFA Diagram is finished.
 > Click Go One Step button or if you clicked Move Automatically button wait 2 sec and you will see the error message that says DFA table is filled.


There is another example for you to see in the application. So if you came up to here I suggest you to complete the other example too.

 > To see the other examples you have to click the Reset button and then select the other regex. Then you good to go.

## Resources
[http://jacobappleton.io/2015/07/20/regex-iv-from-nfa-to-dfa/#tocAnchor-1-3](http://jacobappleton.io/2015/07/20/regex-iv-from-nfa-to-dfa/#tocAnchor-1-3)
[https://www.cs.rochester.edu/~nelson/courses/csc_173/fa/fa.html](https://www.cs.rochester.edu/~nelson/courses/csc_173/fa/fa.html)
[https://www.tutorialspoint.com/automata_theory/deterministic_finite_automaton.htm](https://www.tutorialspoint.com/automata_theory/deterministic_finite_automaton.htm)
[https://www.geeksforgeeks.org/toc-finite-automata-introduction/](https://www.geeksforgeeks.org/toc-finite-automata-introduction/)

# Made by Enes Kamil YILMAZ