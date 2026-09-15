/* Radar Vacinal legado -> ponte de migração para a versão ampliada.
   Mantém o app antigo e seus dados locais intactos; altera apenas CTAs antigos de "Premium / Em breve". */
(function () {
    'use strict';

    const NEW_RADAR = 'https://leothaylor.github.io/radar-vacinal-premium/';

    function migrationUrl(content) {
        const url = new URL(NEW_RADAR);
        url.searchParams.set('utm_source', 'radar_vacinal_antigo');
        url.searchParams.set('utm_medium', 'internal_referral');
        url.searchParams.set('utm_campaign', 'migracao_radar_v2');
        url.searchParams.set('utm_content', content);
        return url.toString();
    }

    function openNewRadar(content) {
        window.open(migrationUrl(content), '_blank', 'noopener,noreferrer');
    }

    function patchHomeCard() {
        const title = Array.from(document.querySelectorAll('h4')).find(el =>
            el.textContent.trim() === 'Radar Vacinal Premium — Em breve'
        );
        if (!title) return;

        const card = title.closest('.rounded-xl');
        if (!card) return;

        title.textContent = 'Novo Radar Vacinal — versão ampliada';
        const texts = title.parentElement ? title.parentElement.querySelectorAll('p') : [];
        if (texts[0]) texts[0].textContent = 'Versão gratuita para diferentes faixas etárias e perfis';
        if (texts[1]) texts[1].textContent = 'Instalável, uso offline, backup, PDF/JPG e Busca Ativa';

        card.classList.remove('opacity-70', 'cursor-not-allowed');
        card.classList.add('cursor-pointer', 'hover:border-[#78C7C7]', 'transition-colors');
        card.setAttribute('role', 'link');
        card.setAttribute('tabindex', '0');
        card.setAttribute('aria-label', 'Acessar novo Radar Vacinal ampliado');
        card.onclick = () => openNewRadar('home_card');
        card.onkeydown = (event) => {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                openNewRadar('home_card');
            }
        };

        const trailing = card.lastElementChild;
        if (trailing && trailing.tagName === 'I') {
            trailing.outerHTML = '<span class="text-[10px] font-black text-white bg-[#78C7C7] px-3 py-2 rounded-lg shadow-sm whitespace-nowrap">Acessar</span>';
        }
    }

    function patchProximas() {
        const block = document.getElementById('msg-premium-proximas');
        if (!block) return;

        const title = block.querySelector('p.font-black');
        if (title) title.textContent = 'Novo Radar Vacinal ampliado';

        const lead = Array.from(block.querySelectorAll('p')).find(el =>
            el.textContent.includes('A partir dos 5 anos')
        );
        if (lead) lead.textContent = 'A partir dos 5 anos, o acompanhamento continua na versão ampliada gratuita:';

        const button = block.querySelector('button');
        if (button) {
            button.textContent = 'Acessar novo Radar Vacinal';
            button.onclick = () => openNewRadar('preview_proximas');
        }
    }

    function patchCalendario() {
        const block = document.getElementById('premium-block-calendario');
        if (!block) return;

        const title = block.querySelector('h4');
        if (title) title.textContent = '5 anos em diante — novo Radar ampliado';

        const button = block.querySelector('button');
        if (button) {
            button.className = 'w-full bg-[#78C7C7] text-white font-bold py-2 rounded-lg text-xs hover:bg-teal-500 transition-colors flex items-center justify-center gap-1.5';
            button.innerHTML = '<i data-lucide="external-link" class="w-3.5 h-3.5"></i> Acessar novo Radar Vacinal';
            button.onclick = () => openNewRadar('preview_calendario');
        }
    }

    function applyMigrationBridge() {
        patchHomeCard();
        patchProximas();
        patchCalendario();
        if (window.lucide) window.lucide.createIcons();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', applyMigrationBridge, { once: true });
    } else {
        applyMigrationBridge();
    }
})();
