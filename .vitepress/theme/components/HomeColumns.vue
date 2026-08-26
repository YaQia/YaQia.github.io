<script setup lang="ts">
import { computed } from "vue";
import { useData } from "vitepress";

interface Column {
  title: string;
  link: string;
  details?: string;
  children?: Column[];
}

const { frontmatter } = useData();
const columns = computed<Column[]>(
  () => (frontmatter.value.columns as Column[] | undefined) ?? []
);
</script>

<template>
  <div v-if="columns.length" class="home-columns">
    <h2 class="hc-section-title">专栏</h2>
    <div class="hc-grid">
      <template v-for="col in columns" :key="col.link">
        <a
          v-if="!col.children?.length"
          class="hc-card hc-simple"
          :href="col.link"
        >
          <span class="hc-title">{{ col.title }}</span>
          <span v-if="col.details" class="hc-details">{{ col.details }}</span>
        </a>
        <div v-else class="hc-card hc-group">
          <a class="hc-group-head" :href="col.link">
            <span class="hc-title hc-title-lg">{{ col.title }}</span>
            <span v-if="col.details" class="hc-details">{{ col.details }}</span>
          </a>
          <div class="hc-children">
            <a
              v-for="child in col.children"
              :key="child.link"
              class="hc-card hc-child"
              :href="child.link"
            >
              <span class="hc-title">{{ child.title }}</span>
              <span v-if="child.details" class="hc-details">
                {{ child.details }}
              </span>
            </a>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<style scoped>
.home-columns {
  max-width: 1152px;
  margin: 0 auto;
  padding: 24px 24px 0;
}

.hc-section-title {
  margin: 0 0 20px;
  font-size: 20px;
  font-weight: 700;
  color: var(--vp-c-text-1);
}

.hc-grid {
  display: grid;
  gap: 16px;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
}

.hc-card {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 22px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 14px;
  background: var(--vp-c-bg-soft);
  text-decoration: none;
  transition: border-color 0.25s, transform 0.25s, box-shadow 0.25s;
}

.hc-card:hover {
  border-color: var(--vp-c-brand-1);
  transform: translateY(-3px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.06);
}

.hc-group {
  grid-column: 1 / -1;
  padding: 28px;
  background: var(--vp-c-bg-soft);
}

.hc-group-head {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 18px;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--vp-c-divider);
  text-decoration: none;
  transition: opacity 0.25s;
}

.hc-group-head:hover {
  opacity: 0.8;
}

.hc-children {
  display: grid;
  gap: 16px;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
}

.hc-child {
  background: var(--vp-c-bg);
}

.hc-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--vp-c-text-1);
}

.hc-title-lg {
  font-size: 24px;
  line-height: 1.2;
}

.hc-details {
  font-size: 14px;
  line-height: 1.65;
  color: var(--vp-c-text-2);
}

@media (max-width: 640px) {
  .home-columns {
    padding: 20px 16px 0;
  }

  .hc-grid {
    grid-template-columns: 1fr;
  }

  .hc-children {
    grid-template-columns: 1fr;
  }

  .hc-card {
    padding: 18px;
  }

  .hc-group {
    padding: 20px;
  }
}
</style>
