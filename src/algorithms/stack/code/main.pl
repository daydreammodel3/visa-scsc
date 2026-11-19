use strict;
use warnings;

my @stack = (undef) x 5;
my $top = -1; # 空のときは -1

sub stack_push {
    my ($x) = @_;
    if ($top == $#stack) { # ⟦full⟧
        return; # いっぱいなので積めない
    }
    $top++; # ⟦inc⟧
    $stack[$top] = $x; # ⟦store⟧
}

sub stack_pop {
    if ($top == -1) { # ⟦empty⟧
        return undef; # 空なので取り出せない
    }
    my $x = $stack[$top]; # ⟦take⟧
    $top--; # ⟦dec⟧
    return $x; # ⟦popret⟧
}

my @out;
stack_push(3);
stack_push(8);
stack_push(5);
push @out, stack_pop();
stack_push(1);
push @out, stack_pop();
push @out, stack_pop();
print "@out\n";
