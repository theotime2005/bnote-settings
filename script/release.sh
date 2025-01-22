#!/bin/bash

# Fonction pour afficher les messages avec une mise en forme
function info {
  echo -e "\033[1;34m[INFO]\033[0m $1"
}

function success {
  echo -e "\033[1;32m[SUCCESS]\033[0m $1"
}

function error {
  echo -e "\033[1;31m[ERROR]\033[0m $1"
}

# Vérifier que nous sommes sur la branche main
current_branch=$(git rev-parse --abbrev-ref HEAD)
if [ "$current_branch" != "main" ]; then
  error "Vous n'êtes pas sur la branche 'main'. Branche actuelle : $current_branch"
  exit 1
fi
info "Vous êtes sur la branche 'main'."

# Vérifier qu'il n'y a pas de modifications non commises
if ! git diff-index --quiet HEAD --; then
  error "Il y a des modifications non commises dans le répertoire de travail."
  exit 1
fi
info "Aucune modification non commise détectée."

# Exécuter npm run release
info "Exécution de 'npm run release'..."
if ! npm run release; then
  error "'npm run release' a échoué."
  exit 1
fi
info "'npm run release' exécuté avec succès."

# Pousser les modifications avec les tags
info "Poussée des modifications et des tags..."
if ! git push --follow-tags; then
  error "Le push des modifications a échoué."
  exit 1
fi
success "Modifications et tags poussés avec succès."

success "Processus de publication terminé avec succès."
