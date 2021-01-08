
#include <stdio.h>

int fib(int num){
    if(num < 2){
        return 1;
    }
    else{
    return fib(num - 1) + fib(num - 2);
    }
}