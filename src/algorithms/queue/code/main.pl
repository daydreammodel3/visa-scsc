use strict;
use warnings;

my @queue = (undef) x 4;
my $head = 0;  # 先頭（次に取り出す位置）
my $tail = 0;  # 次に入れる位置
my $count = 0; # 入っている個数

sub enqueue {
    my ($x) = @_;
    if ($count == @queue) { # ⟦full⟧
        return; # いっぱいなので入れられない
    }
    $queue[$tail] = $x; # ⟦store⟧
    $tail = ($tail + 1) % @queue; # ⟦tail⟧
    $count++; # ⟦tail⟧
}

sub dequeue {
    if ($count == 0) { # ⟦empty⟧
        return undef; # 空なので取り出せない
    }
    my $x = $queue[$head]; # ⟦take⟧
    $head = ($head + 1) % @queue; # ⟦head⟧
    $count--; # ⟦head⟧
    return $x; # ⟦deqret⟧
}

my @out;
enqueue(3);
enqueue(8);
enqueue(5);
push @out, dequeue();
enqueue(1);
enqueue(7);
push @out, dequeue();
push @out, dequeue();
print "@out\n";
