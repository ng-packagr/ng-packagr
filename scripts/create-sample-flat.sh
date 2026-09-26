#!/bin/bash

# Arguments with defaults
OUTPUT_DIR="${1:-./benchmark-library}"
NUM_COMPONENTS="${2:-100}"
STYLE_TYPE="${3:-inline}" # Options: "inline" or "external"

# Validate style type argument
if [[ "$STYLE_TYPE" != "inline" && "$STYLE_TYPE" != "external" ]]; then
  echo "❌ Error: Invalid style type. Please use 'inline' or 'external'."
  exit 1
fi

echo "🚀 Generating benchmark library..."
echo "📂 Target Directory:  $OUTPUT_DIR"
echo "🔢 Sub Entry Points: $NUM_COMPONENTS"
echo "🏗️ Architecture:     $STYLE_TYPE components"

# 1. Create base directories
mkdir -p "$OUTPUT_DIR/src"

# 2. Create parent package.json
cat <<EOF > "$OUTPUT_DIR/package.json"
{
  "name": "benchmark-library",
  "version": "1.0.0",
  "scripts": {
    "build": "ng-packagr -p ng-package.json"
  }
}
EOF

# 3. Create required ng-package.json for ng-packagr
cat <<EOF > "$OUTPUT_DIR/ng-package.json"
{
  "\$schema": "./node_modules/ng-packagr/ng-package.schema.json",
  "dest": "dist",
  "lib": {
    "entryFile": "src/public-api.ts"
  }
}
EOF

# 4. Initialize primary entry point with version
echo -e "// Primary Entry Point\nexport const BENCHMARK_VERSION = '1.0.0';" > "$OUTPUT_DIR/src/public-api.ts"

# 5. Generate the secondary entry points
for ((i=1; i<=NUM_COMPONENTS; i++)); do
  COMP_ID=$(printf "comp-%03d" "$i")
  ENTRY_DIR="$OUTPUT_DIR/$COMP_ID"
  COMPONENT_NAME="Comp${i}Component"
  
  mkdir -p "$ENTRY_DIR"

  # Append secondary entry point export to primary public-api.ts
  echo "export * from 'benchmark-library/$COMP_ID';" >> "$OUTPUT_DIR/src/public-api.ts"

  # Create sub package.json for ng-packagr secondary entrypoint
  cat <<EOF > "$ENTRY_DIR/package.json"
{
  "ngPackage": {
    "lib": {
      "entryFile": "public-api.ts"
    }
  }
}
EOF

  # Create the internal entry point file that exports the component
  echo "export * from './$COMP_ID.component';" > "$ENTRY_DIR/public-api.ts"

  # Generate files based on the chosen strategy
  if [ "$STYLE_TYPE" == "inline" ]; then
    # CASE 1: Completely Inline Component
    cat <<EOF > "$ENTRY_DIR/$COMP_ID.component.ts"
import { Component } from '@angular/core';

@Component({
  selector: 'lib-$COMP_ID',
  template: '<div>Benchmark $COMP_ID</div>',
  standalone: true
})
export class $COMPONENT_NAME {}
EOF

  else
    # CASE 2: External Templates and Stylesheets
    # Create the external HTML template
    echo "<!-- Benchmark Template for $COMP_ID -->" > "$ENTRY_DIR/$COMP_ID.component.html"
    echo "<div class=\"benchmark-container\">Benchmark $COMP_ID</div>" >> "$ENTRY_DIR/$COMP_ID.component.html"
    
    # Create the external SCSS file
    echo "/* Benchmark Stylesheet for $COMP_ID */" > "$ENTRY_DIR/$COMP_ID.component.scss"
    echo ".benchmark-container { display: block; padding: 10px; color: #333; }" >> "$ENTRY_DIR/$COMP_ID.component.scss"

    # Create the Component linking to external files
    cat <<EOF > "$ENTRY_DIR/$COMP_ID.component.ts"
import { Component } from '@angular/core';

@Component({
  selector: 'lib-$COMP_ID',
  templateUrl: './$COMP_ID.component.html',
  styleUrls: ['./$COMP_ID.component.scss'],
  standalone: true
})
export class $COMPONENT_NAME {}
EOF
  fi

done

echo -e "\n✅ Success! Structure generated under '$OUTPUT_DIR' with $NUM_COMPONENTS ($STYLE_TYPE) sub-entry points."
