class RingQueue
  def initialize(size)
    @data = Array.new(size)
    @head = 0  # 先頭（次に取り出す位置）
    @tail = 0  # 次に入れる位置
    @count = 0 # 入っている個数
  end

  def enqueue(x)
    if @count == @data.length # ⟦full⟧
      return # いっぱいなので入れられない
    end
    @data[@tail] = x # ⟦store⟧
    @tail = (@tail + 1) % @data.length # ⟦tail⟧
    @count += 1 # ⟦tail⟧
  end

  def dequeue
    if @count == 0 # ⟦empty⟧
      return nil # 空なので取り出せない
    end
    x = @data[@head] # ⟦take⟧
    @head = (@head + 1) % @data.length # ⟦head⟧
    @count -= 1 # ⟦head⟧
    x # ⟦deqret⟧
  end
end

q = RingQueue.new(4)
out = []
q.enqueue(3)
q.enqueue(8)
q.enqueue(5)
out << q.dequeue
q.enqueue(1)
q.enqueue(7)
out << q.dequeue
out << q.dequeue
puts out.join(" ")
