/** Lightweight, non-simulated points of interest for the expanded neighborhood map. */
export const EXPANDED_CITY_MAP = Object.freeze({
  title: 'Bairro Pilha+',
  locations: Object.freeze([
    { id: 'morro', name: 'Morro da comunidade', zone: 'Comunidade', description: 'Seis moradias coloridas distribuídas pela encosta, ligadas por escadarias e caminhos entre a vegetação.', image: '/assets/world-expansion/community-huts/barraco-03-laje-caixa-azul.png', imageAlt: 'Barraco colorido do morro com laje e caixa d’água azul', state: 'Morro e caminhos' },
    { id: 'residencial', name: 'Área residencial', zone: 'Moradia', description: 'Casas em terrenos próprios e pequenos edifícios de apartamentos. As fachadas e sacadas mostram sinais do cotidiano dos moradores.', image: '/assets/world-expansion/residential-buildings/predio-residencial-03-3-pavimentos-familiar.png', imageAlt: 'Prédio residencial pequeno com sacadas ocupadas', state: 'Casas e prédios' },
    { id: 'comercio', name: 'Polo gastronômico', zone: 'Comércio e serviços', description: 'Paradinho Café e quiosque Bolinho de Carne, com mesas externas e passagem entre a avenida e a área comercial.', image: '/assets/world-expansion/food/cafeznho.png', imageAlt: 'Fachada do Paradinho Café com mesas externas', state: 'Café e quiosque' },
    { id: 'upa', name: 'UPA 24x7', zone: 'Saúde e cuidado', description: 'Unidade de urgência com acesso pela avenida. O terraço verde anexo é dedicado a pausas e atividades de yoga.', image: '/assets/world-expansion/food/hospital-upa-terraco.png', imageAlt: 'Diorama da UPA com ambulância e terraço verde', state: 'UPA e terraço restaurativo' },
    { id: 'pilha-corp', name: 'Pilha Corp', zone: 'Empresa', description: 'Sede térrea de fachada ampla voltada para a avenida, conectada ao mapa operacional da empresa.', image: '/assets/world-expansion/pilha-corp-office/pilha-corp-escritorio-exterior-conceito.png', imageAlt: 'Conceito do escritório térreo da Pilha Corp', state: 'Sede da empresa' },
    { id: 'calcadao', name: 'Calçadão arborizado', zone: 'Espaço público', description: 'Faixa de circulação à beira-mar com palmeiras, bancos e pequenos quiosques para descanso.', image: null, imageAlt: '', state: 'Passeio e convivência' },
    { id: 'praia', name: 'Faixa de areia e mar', zone: 'Orla', description: 'A orla ocupa a frente do bairro, com areia, guarda-sóis e mar. Um espaço aberto para caminhar e contemplar.', image: null, imageAlt: '', state: 'Praia' }
  ])
});
