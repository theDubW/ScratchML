import numpy as np
import pandas as pd

# Assuming existing_data is a global variable that is a pandas DataFrame
existing_data = pd.DataFrame(columns=['label', 'hardness', 'density', 'conductivity', 'shininess', 'shape', 'color'])

def gen_data(n):
    # Ensure n is even for equal class distribution
    n_per_class = n // 2
    
    # Generate features
    labels = np.array([0] * n_per_class + [1] * n_per_class)
    hardness = np.concatenate([
        np.random.randint(3, 6, n_per_class),  # Softer for gold
        np.random.randint(1, 4, n_per_class)  # Harder for pyrite
    ])
    density = np.concatenate([
        np.random.uniform(4, 6, n_per_class),  # Closer to pyrite
        np.random.uniform(18, 20, n_per_class)  # Closer to gold
    ])
    conductivity = np.concatenate([
        np.random.randint(1, 4, n_per_class),  # Higher for gold
        np.random.randint(3, 6, n_per_class)  # Lower for pyrite
    ])
    shininess = np.concatenate([
        np.random.randint(3, 6, n_per_class),  # More shiny for gold
        np.random.randint(1, 3, n_per_class)  # Less shiny for pyrite
    ])
    shapes = np.random.choice(['square', 'circle', 'rectangle'], size=n)
    colors = np.random.choice(['yellow', 'bronze yellow', 'silver yellow'], size=n)
    
    # Create DataFrame
    new_data = pd.DataFrame({
        'label': labels,
        'hardness': hardness,
        'density': density,
        'conductivity': conductivity,
        'shininess': shininess,
        'shape': shapes,
        'color': colors
    })
    
    # Append to the global DataFrame
    global existing_data
    existing_data = pd.concat([existing_data, new_data], ignore_index=True)

# Example usage
gen_data(100)  # This will append 100 new rows to existing_data
