def binary_search(data, target)
  low = 0 # ⟦init⟧
  high = data.length - 1 # ⟦init⟧
  while low <= high # ⟦loop⟧
    mid = (low + high) / 2 # ⟦mid⟧
    if data[mid] == target # ⟦cmp⟧
      return mid # ⟦found⟧
    elsif data[mid] < target # ⟦lt⟧
      low = mid + 1 # ⟦right⟧
    else
      high = mid - 1 # ⟦left⟧
    end
  end
  -1 # ⟦notfound⟧
end

data = [2, 5, 8, 12, 16, 23, 38, 56, 72, 91]
puts binary_search(data, 23)
