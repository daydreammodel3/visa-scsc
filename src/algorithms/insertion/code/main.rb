def insertion_sort(data)
  (1...data.length).each do |i| # ⟦outer⟧
    key = data[i] # ⟦key⟧
    j = i - 1 # ⟦key⟧
    while j >= 0 && data[j] > key # ⟦cmp⟧
      data[j + 1] = data[j] # ⟦shift⟧
      j -= 1 # ⟦shift⟧
    end
    data[j + 1] = key # ⟦insert⟧
  end
end

data = [4, 7, 2, 9, 1, 5]
insertion_sort(data)
puts data.join(" ")
