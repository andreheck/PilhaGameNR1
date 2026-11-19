/** Lightweight, non-simulated points of interest for the expanded neighborhood map. */
export const EXPANDED_CITY_MAP = Object.freeze({
  title: 'Bairro Pilha+',
  locations: Object.freeze([
    { id: 'morro', name: 'Morro da comunidade', zone: 'Comunidade', description: 'Seis barracos coloridos distribuídos pela encosta, ligados por escadarias e caminhos entre a vegetação.', image: '/assets/world-expansion/community-huts/barraco-03-laje-caixa-azul.png', imageAlt: 'Barraco colorido no morro com laje e caixa d’água azul', state: 'Morro e caminhos' },
    { id: 'residencial', name: 'Área residencial', zone: 'Moradia', description: 'Três casas coloridas ocupam os lotes da orla, junto a pequenos edifícios de apartamentos.', image: '/assets/world-expansion/residential-buildings/casa-praia-02-ciano.webp', imageAlt: 'Casa ciano e azul com escada externa na área residencial à beira-mar', state: 'Casas e prédios' },
    { id: 'comercio', name: 'Polo gastronômico', zone: 'Comércio e serviços', description: 'O Paradinho Café e o quiosque Bolinho de Carne ficam junto à avenida, com passagem de pedestres e lotes comerciais.', image: '/assets/world-expansion/food/polo-gastronomico-preview.webp', imageAlt: 'Paradinho Café e quiosque Bolinho de Carne em modelos 3D', state: 'Café e quiosque' },
    { id: 'upa', name: 'UPA 24x7', zone: 'Saúde e cuidado', description: 'Unidade de urgência com acesso pela avenida. O terraço verde anexo é dedicado a pausas e atividades de yoga.', image: '/assets/world-expansion/food/hospital-upa-terraco.png', imageAlt: 'Diorama da UPA com ambulância e terraço verde', state: 'UPA e terraço restaurativo' },
    { id: 'pilha-corp', name: 'Pilha Corp', zone: 'Empresa', description: 'Sede térrea de fachada ampla voltada para a avenida, conectada ao mapa operacional da empresa.', image: '/assets/world-expansion/pilha-corp-office/pilha-corp-escritorio-exterior-conceito.png', imageAlt: 'Conceito do escritório térreo da Pilha Corp', state: 'Sede da empresa' },
    { id: 'calcadao', name: 'Calçadão arborizado', zone: 'Espaço público', description: 'Faixa de circulação à beira-mar com palmeiras, bancos e pequenos quiosques para descanso.', image: null, imageAlt: '', state: 'Passeio e convivência' },
    { id: 'praia', name: 'Faixa de areia e mar', zone: 'Orla', description: 'A orla ocupa a frente do bairro, com areia, guarda-sóis e mar. Um espaço aberto para caminhar e contemplar.', image: null, imageAlt: '', state: 'Praia' }
  ])
});
