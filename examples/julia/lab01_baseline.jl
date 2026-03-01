using Random
using Statistics

"""
Placeholder starter for Julia tabular baseline lab.
Use MLJ.jl and DataFrames.jl for full implementation.
"""

Random.seed!(42)
scores = rand(100)
println("Mean baseline score: ", mean(scores))
