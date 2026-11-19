class Stack
  def initialize(size)
    @data = Array.new(size)
    @top = -1 # 空のときは -1
  end

  def push(x)
    if @top == @data.length - 1 # ⟦full⟧
      return # いっぱいなので積めない
    end
    @top += 1 # ⟦inc⟧
    @data[@top] = x # ⟦store⟧
  end

  def pop
    if @top == -1 # ⟦empty⟧
      return nil # 空なので取り出せない
    end
    x = @data[@top] # ⟦take⟧
    @top -= 1 # ⟦dec⟧
    x # ⟦popret⟧
  end
end

s = Stack.new(5)
out = []
s.push(3)
s.push(8)
s.push(5)
out << s.pop
s.push(1)
out << s.pop
out << s.pop
puts out.join(" ")
