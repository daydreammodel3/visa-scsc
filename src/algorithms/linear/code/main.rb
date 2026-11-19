def linear_search(data, target)
  (0...data.length).each do |i| # ⟦loop⟧
    if data[i] == target # ⟦cmp⟧
      return i # ⟦found⟧
    end
  end
  -1 # ⟦notfound⟧
end

data = [7, 3, 9, 4, 6, 2]
puts linear_search(data, 4)
