<template>
  <v-app>
    <dashboard-core-app-bar v-model="expandOnHover" />

    <!-- <dashboard-core-drawer :expand-on-hover.sync="expandOnHover" /> -->

    <dashboard-core-view />

    <!-- <dashboard-core-settings v-model="expandOnHover" /> -->

  </v-app>
</template>

<script>
  import { BASE_API } from '../../api'
  import axios from 'axios'
  
  export default {
    name: 'DashboardIndex',

    components: {
      DashboardCoreAppBar: () => import('./components/core/AppBar'),
      // DashboardCoreDrawer: () => import('./components/core/Drawer'),
      DashboardCoreSettings: () => import('./components/core/Settings'),
      DashboardCoreView: () => import('./components/core/View'),
    },

    data: () => ({
      expandOnHover: false,
    }),

    computed: {
      isIdle() {
        return this.$store.state.idleVue.isIdle;
      }
    }
  }
</script>

<style lang="scss">
  tbody tr:nth-of-type(odd) {
    background-color: rgba(0, 0, 0, .05);
  }
  .highcharts-credits {
    display: none;
  }

  tr.v-data-table__mobile-table-row:nth-of-type(odd) td.v-data-table__mobile-row{
    background: rgba(0, 0, 0, .05);
  }

  .theme--light.v-data-table.custom-alert {
    border: 1px solid #dddddd;

    thead tr:last-child th  {
      background: #0c2c52;
      color: white !important;
      font-weight: 500 !important;

      i {
        color: white !important;
      }
    }

    thead tr:last-child th {
      padding: .5rem;
    }
    
    th + th { border-left:1px solid #dddddd; }
    td + td { border-left:1px solid #dddddd; }
  }

  .navbar-logo {
    position: fixed;
    left: calc(50% - 100px);
    margin-top: 15px;
    border-radius: 4px;
  }

  .bg-dead {
    background: #E0E0E;
  }

  .min-50 {
    min-height: 50px;
  }

  .min-vh {
    min-height: calc(100vh - 203px)
  }

  .mt-48 {
    margin-top: 48px;
  }

  .v-btn.active {
    background: #e8960c;
  } 

  .v-list-item-group .v-list-item--active {
    color: #e8960c;

    &::before {
      opacity: 0.9;
    }
  }

  .v-menu__content--fixed.menuable__content__active {
    position: absolute;
    width: 100%;
    max-width: 100%;
    top: 48px !important;
    left: 0 !important;
    border-top: .5px solid white;

    .theme--light.v-list {
      background: #0c2c52;

      .v-subheader {
        color: white !important;
      }

      span.v-list-item__action-text {
        color: white !important;
        font-weight: bold;
      }

      .v-list-item__icon i {
        color: white !important;
      }
    }
  }

  .p-relateive {
    position: relative;
  }
</style>
