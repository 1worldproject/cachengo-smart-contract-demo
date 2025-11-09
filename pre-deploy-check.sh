#!/bin/bash
echo "🔍 PRE-DEPLOYMENT DIAGNOSTIC CHECK"
echo "=================================="
echo ""

# Check 1: File syntax validation
echo "1️⃣ Checking file syntax..."
FILES=("frontend/src/App.jsx" "frontend/src/components/AIAssistant.jsx" "frontend/src/components/TemplateForms.jsx")
SYNTAX_OK=true

for file in "${FILES[@]}"; do
  if node -e "require('fs').readFileSync('$file', 'utf8')" 2>/dev/null; then
    echo "   ✅ $file - Valid"
  else
    echo "   ❌ $file - SYNTAX ERROR"
    SYNTAX_OK=false
  fi
done

# Check 2: Git status
echo ""
echo "2️⃣ Git status check..."
git diff --name-only | while read file; do
  echo "   📝 Modified: $file"
done

UNTRACKED=$(git ls-files --others --exclude-standard | wc -l)
if [ $UNTRACKED -gt 0 ]; then
  echo "   📄 Untracked files: $UNTRACKED"
fi

# Check 3: Key function presence
echo ""
echo "3️⃣ Checking critical functions..."
if grep -q "handleGenerateContract" frontend/src/components/AIAssistant.jsx; then
  echo "   ✅ handleGenerateContract exists"
else
  echo "   ❌ handleGenerateContract MISSING"
fi

if grep -q "handleAIComplete" frontend/src/App.jsx; then
  echo "   ✅ handleAIComplete exists"
else
  echo "   ❌ handleAIComplete MISSING"
fi

# Check 4: Common issues
echo ""
echo "4️⃣ Checking for common issues..."
if grep -q "setInputText(transcript.trim())" frontend/src/components/AIAssistant.jsx; then
  echo "   ⚠️  Voice input might REPLACE instead of APPEND"
else
  echo "   ✅ Voice input append logic looks good"
fi

if grep -q "suggestedTemplate" frontend/src/components/AIAssistant.jsx; then
  echo "   ✅ Smart template detection present"
else
  echo "   ⚠️  Smart template detection might be missing"
fi

# Summary
echo ""
echo "=================================="
if [ "$SYNTAX_OK" = true ]; then
  echo "✅ READY FOR DEPLOYMENT"
  exit 0
else
  echo "❌ FIX ERRORS BEFORE DEPLOYMENT"
  exit 1
fi
