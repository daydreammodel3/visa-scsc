def factorial(n) # ⟦call⟧
  if n <= 1 # ⟦base⟧
    return 1 # ⟦ret1⟧
  end
  n * factorial(n - 1) # ⟦rec,ret⟧
end

puts factorial(4)
